import React, { useState, useEffect, useRef } from "react";
import AnimeCommentCard from "./anime-comment-card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { API_BASE_URL } from "@/config";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  user: User;
  body: string;
  created_at: string;
  likes?: number;
  dislikes?: number;
  replies?: Comment[];
}

// Інтерфейс для коментарів з API
interface ApiComment {
  id: string;
  body: string;
  is_spoiler?: boolean;
  is_approved?: boolean;
  is_reply?: boolean;
  user_id?: string;
  commentable_type?: string;
  commentable_id?: string;
  commentable_type_label?: string;
  created_at: string;
  updated_at?: string;
  user: User;
  children?: ApiComment[]; // 👈 Дочірні коментарі
  count_likes?: number;    // 👈 Кількість лайків
  count_dislikes?: number; // 👈 Кількість дізлайків
}

interface AnimeCommentSectionProps {
  comments?: Comment[] | ApiComment[];
  isLoading?: boolean;
  commentableType?: string; // зробили опціональними
  commentableId?: string;
  token?: string;
}

// Fallback користувач, якщо не вдалося отримати дані
const fallbackUser = {
  id: "unknown-user",
  name: "Користувач",
  avatar: "/assets/mock-user-logo.png",
};

// Функція для конвертації API коментарів в компонентний формат
const convertApiComment = (apiComment: ApiComment): Comment => {
  console.log("🔄 Конвертуємо API коментар:", apiComment);
  
  // Рекурсивно конвертуємо дочірні коментарі
  const replies = apiComment.children 
    ? apiComment.children.map(child => convertApiComment(child))
    : [];
  
  const converted: Comment = {
    id: apiComment.id,
    user: apiComment.user || {
      id: apiComment.user_id || "unknown",
      name: "Користувач",
      avatar: "/assets/mock-user-logo.png"
    },
    body: apiComment.body,
    created_at: apiComment.created_at,
    likes: apiComment.count_likes || 0,        // 👈 Мапимо count_likes
    dislikes: apiComment.count_dislikes || 0,  // 👈 Мапимо count_dislikes
    replies: replies                           // 👈 Додаємо дочірні коментарі
  };
  
  console.log("✅ Сконвертований коментар:", converted);
  return converted;
};

// Функція для перевірки чи коментар з API
const isApiComment = (comment: Comment | ApiComment): comment is ApiComment => {
  return 'user' in comment && 'children' in comment;
};

const AnimeCommentSection: React.FC<AnimeCommentSectionProps> = ({
  comments: initialComments = [],
  isLoading = false,
  commentableType,
  commentableId,
  token,
}) => {
  // Конвертуємо API коментарі в компонентний формат
  const convertedComments = initialComments.map(comment => 
    isApiComment(comment) ? convertApiComment(comment) : comment
  );

  const [comments, setComments] = useState<Comment[]>(convertedComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    parentId?: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Refs для textarea
  const newCommentRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Функція для форматування тексту
  const formatText = (type: string, textareaRef: React.RefObject<HTMLTextAreaElement | null>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = "";
    
    switch (type) {
      case "bold":
        formattedText = `**${selectedText || "жирний текст"}**`;
        break;
      case "italic":
        formattedText = `*${selectedText || "курсив"}*`;
        break;
      case "emoji":
        formattedText = selectedText + "😊";
        break;
      case "link":
        formattedText = `[${selectedText || "текст посилання"}](URL)`;
        break;
      case "plus":
        formattedText = selectedText + " ✓";
        break;
      default:
        return;
    }

    const newValue = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    // Оновлюємо state
    setNewComment(newValue);
    
    // Встановлюємо курсор
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  console.log("🔍 AnimeCommentSection props:", {
    commentableType,
    commentableId,
    token: token ? "присутній" : "відсутній",
    initialCommentsLength: initialComments.length,
    currentUser: currentUser ? currentUser.name : "не завантажено",
    firstComment: initialComments[0] ? {
      id: initialComments[0].id,
      hasChildren: 'children' in initialComments[0],
      childrenCount: 'children' in initialComments[0] ? initialComments[0].children?.length : 0
    } : null
  });

  // Отримуємо дані поточного користувача при зміні токена
  useEffect(() => {
    async function fetchCurrentUser() {
      if (!token) {
        console.warn("⚠️ Токен відсутній, не можемо отримати дані користувача");
        return;
      }

      try {
        console.log("👤 Отримуємо дані поточного користувача...");
        const res = await fetch(`${API_BASE_URL}user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ Помилка отримання користувача:", res.status, res.statusText);
          return;
        }

        const userData = await res.json();
        console.log("✅ Дані користувача отримано:", userData);
        
        // Адаптуємо дані до нашого інтерфейсу
        const user: User = {
          id: userData.id || userData.data?.id || "unknown",
          name: userData.name || userData.data?.name || "Користувач",
          avatar: userData.avatar || userData.data?.avatar || "/assets/mock-user-logo.png"
        };
        
        setCurrentUser(user);
        console.log("👤 Поточний користувач встановлено:", user);
      } catch (error) {
        console.error("❌ Помилка при отриманні користувача:", error);
      }
    }

    if (token) {
      fetchCurrentUser();
    }
  }, [token, API_BASE_URL]);

  // Оновлюємо коментарі при зміні початкових даних
  useEffect(() => {
    const converted = initialComments.map(comment => 
      isApiComment(comment) ? convertApiComment(comment) : comment
    );
    setComments(converted);
  }, [initialComments]);

  // Функція для створення коментаря на бекенді
  async function postComment(body: string) {
    console.log("📝 postComment викликано з body:", body);
    console.log("🔧 postComment параметри:", {
      commentableType,
      commentableId,
      token: token ? "присутній" : "відсутній",
      API_BASE_URL
    });

    if (!commentableType || !commentableId || !token) {
      const errorMsg = "Необхідна авторизація для додавання коментарів";
      console.error("❌ postComment помилка:", errorMsg);
      console.error("❌ Відсутні параметри:", {
        commentableType: !commentableType ? "відсутній" : "присутній",
        commentableId: !commentableId ? "відсутній" : "присутній", 
        token: !token ? "відсутній" : "присутній"
      });
      throw new Error(errorMsg);
    }

    const requestBody = {
      commentable_type:  "AnimeSite\\Models\\Anime", // 👈 Використовуємо значення з props
      commentable_id: commentableId,
      body,
      is_spoiler: false,  // 👈 Додаємо обов'язкові поля
      is_approved: true   // 👈 Додаємо обов'язкові поля
    };

    console.log("🚀 Відправка запиту на:", `${API_BASE_URL}comments`);
    console.log("📦 Тіло запиту:", requestBody);
    console.log("🔑 Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.substring(0, 10)}...`
    });

    try {
      const res = await fetch(`${API_BASE_URL}comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Відповідь сервера:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Помилка сервера:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText
        });
        throw new Error(`Не вдалося додати коментар: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("✅ Успішна відповідь:", responseData);
      console.log("🔍 Структура відповіді:", {
        hasComment: 'comment' in responseData,
        hasData: 'data' in responseData,
        keys: Object.keys(responseData),
        responseData: JSON.stringify(responseData, null, 2)
      });
      return responseData;
    } catch (error) {
      console.error("❌ Network або інша помилка:", error);
      throw error;
    }
  }

  // Функція для створення відповіді
  async function postReply(body: string, parentId: string) {
    console.log("💬 postReply викликано:", { body, parentId });
    
    if (!token) {
      const errorMsg = "Необхідна авторизація для додавання відповідей";
      console.error("❌ postReply помилка:", errorMsg);
      throw new Error(errorMsg);
    }

    const requestBody = {
      commentable_type: "AnimeSite\\Models\\Comment", // 👈 Для відповідей це коментар
      commentable_id: parentId, // 👈 ID коментаря на який відповідаємо
      body: body, // 👈 Просто текст відповіді
      is_spoiler: false,
      is_approved: true
    };

    console.log("🚀 Відправка запиту на:", `${API_BASE_URL}comments`);
    console.log("📦 Тіло запиту:", requestBody);
    console.log("🔑 Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.substring(0, 10)}...`
    });

    try {
      const res = await fetch(`${API_BASE_URL}comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Відповідь сервера:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Помилка сервера:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText
        });
        throw new Error(`Не вдалося додати відповідь: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("✅ Успішна відповідь:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ Network або інша помилка:", error);
      throw error;
    }
  }

  const handleAddComment = async () => {
    console.log("🎯 handleAddComment викликано");
    console.log("📝 newComment значення:", `"${newComment}"`);
    console.log("📝 newComment.trim():", `"${newComment.trim()}"`);
    console.log("📝 Довжина після trim:", newComment.trim().length);

    if (!newComment.trim()) {
      console.warn("⚠️ Порожній коментар, повертаємось");
      return;
    }

    console.log("✅ Коментар не порожній, продовжуємо...");

    try {
      console.log("🚀 Викликаємо postComment...");
      const data = await postComment(newComment.trim());
      
      console.log("✅ postComment завершено успішно:", data);

      // Безпечно отримуємо ID коментаря з різних можливих структур відповіді
      const commentId = data?.comment?.id || data?.data?.id || data?.id || 'temp-' + Date.now();
      console.log("🆔 ID нового коментаря:", commentId);

      // Використовуємо дані поточного користувача або fallback
      const userForComment = currentUser || fallbackUser;
      console.log("👤 Користувач для коментаря:", userForComment);

      const newCommentObj = {
        id: commentId,
        user: userForComment,
        body: newComment,
        created_at: "щойно",
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      console.log("📝 Додаємо новий коментар в стейт:", newCommentObj);

      setComments((prev) => {
        const updated = [...prev, newCommentObj];
        console.log("📊 Оновлений список коментарів:", updated);
        return updated;
      });
      
      setNewComment("");
      console.log("✅ Коментар успішно додано!");
    } catch (error) {
      console.error("❌ Помилка в handleAddComment:", error);
      console.error("❌ Деталі помилки:", {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      alert((error as Error).message);
    }
  };

  const handleAddReply = async (id: string, parentId?: string) => {
    console.log("💬 handleAddReply викликано:", { id, parentId, replyText });
    
    if (!replyText.trim()) {
      console.warn("⚠️ Порожня відповідь, повертаємось");
      return;
    }

    try {
      const data = await postReply(replyText.trim(), id);

      // Безпечно отримуємо ID відповіді з різних можливих структур
      const replyId = data?.comment?.id || data?.data?.id || data?.id || 'temp-reply-' + Date.now();
      console.log("🆔 ID нової відповіді:", replyId);

      // Використовуємо дані поточного користувача або fallback
      const userForReply = currentUser || fallbackUser;
      console.log("👤 Користувач для відповіді:", userForReply);

      const newReply: Comment = {
        id: replyId,
        user: userForReply,
        body: replyText,
        created_at: "щойно",
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      console.log("💬 Додаємо нову відповідь:", newReply);

      // Додаємо відповідь до правильного коментаря
      setComments((prev) =>
        prev.map((c) => {
          if (parentId) {
            // Якщо це відповідь на відповідь
            if (c.id === parentId) {
              return {
                ...c,
                replies: (c.replies || []).map((r) =>
                  r.id === id
                    ? { ...r, replies: [...(r.replies || []), newReply] }
                    : r
                ),
              };
            }
          } else if (c.id === id) {
            // Якщо це відповідь на основний коментар
            return {
              ...c,
              replies: [...(c.replies || []), newReply],
            };
          }
          return c;
        })
      );

      setReplyTo(null);
      setReplyText("");
      console.log("✅ Відповідь успішно додано!");
    } catch (error) {
      console.error("❌ Помилка в handleAddReply:", error);
      alert((error as Error).message);
    }
  };

  const handleLike = async (id: string, parentId?: string) => {
  console.log("👍 handleLike:", { id, parentId });

  try {
    const res = await fetch(`${API_BASE_URL}comment-likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // заміни token на реальний
      },
      body: JSON.stringify({
        comment_id: id,
        is_liked: true, // або не передавати — бо це 'sometimes'
      }),
    });

    if (!res.ok) {
      throw new Error("Помилка під час лайкування коментаря");
    }

    // Якщо успішно — оновити стан
    setComments((prev) =>
      prev.map((c) => {
        if (parentId && c.id === parentId) {
          return {
            ...c,
            replies: (c.replies || []).map((r) =>
              r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
            ),
          };
        } else if (c.id === id) {
          return { ...c, likes: (c.likes || 0) + 1 };
        }
        return c;
      })
    );
  } catch (error) {
    console.error("❌ handleLike error:", error);
    // Можна показати сповіщення або toast
  }
};

  const handleDislike = async (id: string, parentId?: string) => {
  console.log("👎 handleDislike:", { id, parentId });

  try {
    const res = await fetch(`${API_BASE_URL}comment-likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // встав реальний токен
      },
      body: JSON.stringify({
        comment_id: id,
        is_liked: false,
      }),
    });

    if (!res.ok) {
      throw new Error("Помилка під час дизлайку коментаря");
    }

    // Оновити локальний стан після успіху
    setComments((prev) =>
      prev.map((c) => {
        if (parentId && c.id === parentId) {
          return {
            ...c,
            replies: (c.replies || []).map((r) =>
              r.id === id ? { ...r, dislikes: (r.dislikes || 0) + 1 } : r
            ),
          };
        } else if (c.id === id) {
          return { ...c, dislikes: (c.dislikes || 0) + 1 };
        }
        return c;
      })
    );
  } catch (error) {
    console.error("❌ handleDislike error:", error);
    // Можна показати toast / alert
  }
};


  // Перевіряємо чи можна додавати коментарі
  const canAddComments = commentableType && commentableId && token;
  console.log("🔒 canAddComments:", canAddComments);
  console.log("👤 currentUser:", currentUser);

  return (
    <div className="mt-4 max-w-2xl mx-auto w-full">
      {isLoading ? (
        <>
          <Skeleton height={32} width={220} className="mb-6" />
          {canAddComments && (
            <div className="bg-[#18191C] border border-[#23242A] rounded-2xl p-6 mb-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} height={32} width={32} />
                  ))}
                </div>
                <Skeleton height={1} width={400} className="mb-2" />
                <Skeleton height={60} width={400} className="mb-2" />
                <div className="flex justify-end">
                  <Skeleton height={36} width={120} />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <AnimeCommentCard
                key={i}
                isLoading
                avatarUrl=""
                username=""
                timeAgo=""
                text=""
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            Обговорення{" "}
            <span className="text-[#B6B6B6] text-xl">({comments.length})</span>
          </h2>
          
          {canAddComments && (
            <div className="bg-[#18191C] border border-[#23242A] rounded-2xl p-6 mb-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    onClick={() => formatText("plus", newCommentRef)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#23242A] text-white font-bold hover:bg-[#33344A] transition"
                    title="Додати галочку"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => formatText("bold", newCommentRef)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#23242A] text-white font-bold hover:bg-[#33344A] transition"
                    title="Жирний текст"
                  >
                    B
                  </button>
                  <button 
                    onClick={() => formatText("italic", newCommentRef)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#23242A] text-white font-bold hover:bg-[#33344A] transition"
                    title="Курсивний текст"
                  >
                    i
                  </button>
                  <button 
                    onClick={() => formatText("emoji", newCommentRef)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#23242A] text-white font-bold hover:bg-[#33344A] transition"
                    title="Додати емодзі"
                  >
                    🙂
                  </button>
                  <button 
                    onClick={() => formatText("link", newCommentRef)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#23242A] text-white font-bold hover:bg-[#33344A] transition"
                    title="Додати посилання"
                  >
                    📎
                  </button>
                </div>
                <div className="w-full border-t border-[#888] mb-0" />
                <textarea
                  ref={newCommentRef}
                  className="bg-[#111113] text-white rounded-2xl border border-[#888] p-5 min-h-[60px] resize-none focus:outline-none focus:border-[#888] mb-2 transition-colors placeholder:text-[#888] text-sm w-full"
                  placeholder="Напишіть повідомлення..."
                  value={newComment}
                  onChange={(e) => {
                    console.log("📝 newComment змінюється на:", e.target.value);
                    setNewComment(e.target.value);
                  }}
                />
                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 rounded-lg bg-[#23242A] text-white text-base font-semibold border border-[#44454A] hover:bg-[#33344A] transition"
                    onClick={() => {
                      console.log("🔘 Кнопка 'Відправити' натиснута");
                      handleAddComment();
                    }}
                  >
                    Відправити
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {comments.length === 0 ? (
              <div className="text-white text-lg">Коментарів поки немає 😔</div>
            ) : (
              comments.map((comment) => {
                console.log("🔍 Відображаємо коментар:", {
                  id: comment.id,
                  user: comment.user.name,
                  body: comment.body.substring(0, 50) + "...",
                  repliesCount: comment.replies?.length || 0,
                  likes: comment.likes,
                  dislikes: comment.dislikes
                });
                
                return (
                  <div key={comment.id}>
                    <AnimeCommentCard
                      avatarUrl={comment.user.avatar}
                      username={comment.user.name}
                      timeAgo={comment.created_at}
                      text={comment.body}
                      likes={comment.likes || 0}
                      dislikes={comment.dislikes || 0}
                      onLike={() => handleLike(comment.id)}
                      onDislike={() => handleDislike(comment.id)}
                      onReply={canAddComments ? () => setReplyTo({ id: comment.id }) : undefined}
                    />

                    {replyTo && replyTo.id === comment.id && !replyTo.parentId && canAddComments && (
                      <ReplyForm
                        value={replyText}
                        onChange={setReplyText}
                        onCancel={() => {
                          setReplyTo(null);
                          setReplyText("");
                        }}
                        onSubmit={() => handleAddReply(comment.id)}
                      />
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-16 mt-2 flex flex-col gap-4">
                        {comment.replies.map((reply) => {
                          console.log("💬 Відображаємо відповідь:", {
                            id: reply.id,
                            user: reply.user.name,
                            body: reply.body.substring(0, 30) + "...",
                            parentId: comment.id,
                            likes: reply.likes,
                            dislikes: reply.dislikes
                          });
                          
                          return (
                            <div key={reply.id}>
                              <AnimeCommentCard
                                avatarUrl={reply.user.avatar}
                                username={reply.user.name}
                                timeAgo={reply.created_at}
                                text={reply.body}
                                likes={reply.likes || 0}
                                dislikes={reply.dislikes || 0}
                                isReply
                                onLike={() => handleLike(reply.id, comment.id)}
                                onDislike={() => handleDislike(reply.id, comment.id)}
                                onReply={canAddComments ? () =>
                                  setReplyTo({ id: reply.id, parentId: comment.id }) : undefined
                                }
                              />

                              {replyTo &&
                                replyTo.id === reply.id &&
                                replyTo.parentId === comment.id && 
                                canAddComments && (
                                  <ReplyForm
                                    value={replyText}
                                    onChange={setReplyText}
                                    onCancel={() => {
                                      setReplyTo(null);
                                      setReplyText("");
                                    }}
                                    onSubmit={() =>
                                      handleAddReply(reply.id, comment.id)
                                    }
                                    nested
                                  />
                                )}

                              {reply.replies && reply.replies.length > 0 && (
                                <div className="pl-12 mt-2 flex flex-col gap-4">
                                  {reply.replies.map((subreply) => {
                                    console.log("💬💬 Відображаємо під-відповідь:", {
                                      id: subreply.id,
                                      user: subreply.user.name,
                                      body: subreply.body.substring(0, 30) + "..."
                                    });
                                    
                                    return (
                                      <AnimeCommentCard
                                        key={subreply.id}
                                        avatarUrl={subreply.user.avatar}
                                        username={subreply.user.name}
                                        timeAgo={subreply.created_at}
                                        text={subreply.body}
                                        likes={subreply.likes || 0}
                                        dislikes={subreply.dislikes || 0}
                                        isReply
                                      />
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Компонент для відповіді
const ReplyForm: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  nested?: boolean;
}> = ({ value, onChange, onSubmit, onCancel, nested }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Функція для форматування тексту в відповіді
  const formatReplyText = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = "";
    
    switch (type) {
      case "bold":
        formattedText = `**${selectedText || "жирний текст"}**`;
        break;
      case "italic":
        formattedText = `*${selectedText || "курсив"}*`;
        break;
      case "emoji":
        formattedText = selectedText + "😊";
        break;
      case "link":
        formattedText = `[${selectedText || "текст посилання"}](URL)`;
        break;
      case "plus":
        formattedText = selectedText + " ✓";
        break;
      default:
        return;
    }

    const newValue = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    onChange(newValue);
    
    // Встановлюємо курсор
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  return (
    <div
      className={`${
        nested ? "pl-12" : "pl-16"
      } mt-2 flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => formatReplyText("plus")}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-[#23242A] text-white text-xs font-bold hover:bg-[#33344A] transition"
          title="Додати галочку"
        >
          +
        </button>
        <button 
          onClick={() => formatReplyText("bold")}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-[#23242A] text-white text-xs font-bold hover:bg-[#33344A] transition"
          title="Жирний текст"
        >
          B
        </button>
        <button 
          onClick={() => formatReplyText("italic")}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-[#23242A] text-white text-xs font-bold hover:bg-[#33344A] transition"
          title="Курсивний текст"
        >
          i
        </button>
        <button 
          onClick={() => formatReplyText("emoji")}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-[#23242A] text-white text-xs font-bold hover:bg-[#33344A] transition"
          title="Додати емодзі"
        >
          🙂
        </button>
        <button 
          onClick={() => formatReplyText("link")}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-[#23242A] text-white text-xs font-bold hover:bg-[#33344A] transition"
          title="Додати посилання"
        >
          📎
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="bg-[#111113] text-white rounded-2xl border border-[#888] p-4 min-h-[40px] resize-none focus:outline-none focus:border-[#888] text-[18px] transition-colors placeholder:text-[#888] w-full"
        placeholder="Ваша відповідь..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-1 rounded-lg bg-[#23242A] text-white text-base font-semibold border border-[#44454A] hover:bg-[#33344A] transition"
          onClick={onSubmit}
        >
          Відповісти
        </button>
        <button
          className="px-4 py-1 rounded-lg bg-transparent text-[#888] border border-[#44454A] hover:bg-[#23242A] transition"
          onClick={onCancel}
        >
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default AnimeCommentSection;