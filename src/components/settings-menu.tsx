"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ToggleSwitch from "@/components/toggle-switch";
import SettingsSidebar from "@/components/settings-sidebar";
import {
  SettingsIcon,
  ProfileSettingsIcon,
  SecuritySettingsIcon,
  ListSettingsIcon,
  PaymentSettingsIcon,
  NotificationSettingsIcon,
  CustomizationSettingsIcon,
} from "@/components/settings-icons";
import SettingsSelect from "@/components/ui/settings-select";
import { Input } from "@/components/ui/input";
import StandartButtonIcon from "@/components/ui/standart-button-icon";
import SettingsProfileTab from "@/components/settings-profile-tab";
import SettingsPreferencesTab from "@/components/settings-preferences-tab";
import SettingsSecurityTab from "@/components/settings-security-tab";
import SettingsNotificationsTab from "./settings-notifications-tab";
import { useAuth } from "@/contexts/auth-context";
import { createAuthenticatedFetch } from "@/contexts/auth-context";
import { API_BASE_URL } from "@/config";

interface UserSettings {
  id: number;
  name: string;
  email: string;
  role: string;
  gender: string | null;
  avatar: string | null;
  backdrop: string | null;
  description: string | null;
  birthday: string | null;
  allow_adult: boolean;
  is_auto_next: boolean;
  is_auto_play: boolean;
  is_auto_skip_intro: boolean;
  is_private_favorites: boolean;
  notify: {
    new_episodes: boolean;
    episode_date_changes: boolean;
    announcement_to_ongoing: boolean;
    comment_replies: boolean;
    comment_likes: boolean;
    review_replies: boolean;
    planned_reminders: boolean;
    new_selections: boolean;
    status_changes: boolean;
    new_seasons: boolean;
    subscription_expiration: boolean;
    subscription_renewal: boolean;
    payment_issues: boolean;
    tariff_changes: boolean;
    site_updates: boolean;
    maintenance: boolean;
    security_changes: boolean;
    new_features: boolean;
  };
}

// Інтерфейс для відстеження змін
interface SettingsState {
  username: string;
  about: string;
  birthdate: string;
  gender: string;
  contentRestriction: string;
  isAutoNext: boolean;
  isAutoPlay: boolean;
  isAutoSkipIntro: boolean;
  isPrivateFavorites: boolean;
  commentReply: boolean;
  commentMention: boolean;
  commentInCollection: boolean;
  commentInEdit: boolean;
  commentRating: boolean;
  collectionRating: boolean;
  editAccepted: boolean;
  editRejected: boolean;
  animeUpdate: boolean;
  myAnime: boolean;
  userFollow: boolean;
  system: boolean;

  // Всі нові поля нотифікацій
  newEpisodes: boolean;
  episodeDateChanges: boolean;
  announcementToOngoing: boolean;
  commentReplies: boolean;
  commentLikes: boolean;
  reviewReplies: boolean;
  plannedReminders: boolean;
  newSelections: boolean;
  statusChanges: boolean;
  newSeasons: boolean;
  subscriptionExpiration: boolean;
  subscriptionRenewal: boolean;
  paymentIssues: boolean;
  tariffChanges: boolean;
  siteUpdates: boolean;
  maintenance: boolean;
  securityChanges: boolean;
  newFeatures: boolean;
}

const navItems = [
  { label: "Основні налаштування", icon: SettingsIcon },
  { label: "Профіль", icon: ProfileSettingsIcon },
  { label: "Безпека", icon: SecuritySettingsIcon },
  { label: "Сповіщення", icon: NotificationSettingsIcon },
];

const SettingsMenu = () => {
  const { token, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [initialSettingsReady, setInitialSettingsReady] = useState(false);

  // Референс для початкових значень
  const initialSettings = useRef<SettingsState | null>(null);

  // Local state for form management
  const [showHiddenSubs, setShowHiddenSubs] = useState(false);
  const [contentRestriction, setContentRestriction] = useState("16+");
  const [lang, setLang] = useState("ua");
  const [audioLang, setAudioLang] = useState("ua");
  const [subsLang, setSubsLang] = useState("ua");
  const [emailLang, setEmailLang] = useState("ua");
  const [emailAll, setEmailAll] = useState(true);
  const [emailNews, setEmailNews] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Profile settings state
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [nickname, setNickname] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [cover, setCover] = useState("");

  // Security tab state
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Player preferences
  const [allowAdult, setAllowAdult] = useState(false);
  const [isAutoNext, setIsAutoNext] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isAutoSkipIntro, setIsAutoSkipIntro] = useState(false);
  const [isPrivateFavorites, setIsPrivateFavorites] = useState(false);

  // OLD Notification settings state (для сумісності)
  const [commentReply, setCommentReply] = useState(false);
  const [commentMention, setCommentMention] = useState(false);
  const [commentInCollection, setCommentInCollection] = useState(false);
  const [commentInEdit, setCommentInEdit] = useState(false);
  const [commentRating, setCommentRating] = useState(false);
  const [collectionRating, setCollectionRating] = useState(false);
  const [editAccepted, setEditAccepted] = useState(false);
  const [editRejected, setEditRejected] = useState(false);
  const [animeUpdate, setAnimeUpdate] = useState(false);
  const [myAnime, setMyAnime] = useState(false);
  const [userFollow, setUserFollow] = useState(false);
  const [system, setSystem] = useState(false);

  // NEW Notification settings state (для нового інтерфейсу)
  const [newEpisodes, setNewEpisodes] = useState(false);
  const [episodeDateChanges, setEpisodeDateChanges] = useState(false);
  const [announcementToOngoing, setAnnouncementToOngoing] = useState(false);
  const [commentReplies, setCommentReplies] = useState(false);
  const [commentLikes, setCommentLikes] = useState(false);
  const [reviewReplies, setReviewReplies] = useState(false);
  const [plannedReminders, setPlannedReminders] = useState(false);
  const [newSelections, setNewSelections] = useState(false);
  const [statusChanges, setStatusChanges] = useState(false);
  const [newSeasons, setNewSeasons] = useState(false);
  const [subscriptionExpiration, setSubscriptionExpiration] = useState(false);
  const [subscriptionRenewal, setSubscriptionRenewal] = useState(false);
  const [paymentIssues, setPaymentIssues] = useState(false);
  const [tariffChanges, setTariffChanges] = useState(false);
  const [siteUpdates, setSiteUpdates] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [securityChanges, setSecurityChanges] = useState(false);
  const [newFeatures, setNewFeatures] = useState(false);

  // Локальні файли для завантаження
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Функція для отримання поточного стану настройок
  const getCurrentSettings = (): SettingsState => ({
    username,
    about,
    birthdate,
    gender,
    contentRestriction,
    isAutoNext,
    isAutoPlay,
    isAutoSkipIntro,
    isPrivateFavorites,
    commentReply,
    commentMention,
    commentInCollection,
    commentInEdit,
    commentRating,
    collectionRating,
    editAccepted,
    editRejected,
    animeUpdate,
    myAnime,
    userFollow,
    system,

    // Всі нові поля нотифікацій
    newEpisodes,
    episodeDateChanges,
    announcementToOngoing,
    commentReplies,
    commentLikes,
    reviewReplies,
    plannedReminders,
    newSelections,
    statusChanges,
    newSeasons,
    subscriptionExpiration,
    subscriptionRenewal,
    paymentIssues,
    tariffChanges,
    siteUpdates,
    maintenance,
    securityChanges,
    newFeatures,
  });

  // Функція для отримання змінених полів
  const getChangedFields = () => {
    if (!initialSettings.current || !initialSettingsReady) {
      console.log("getChangedFields: initialSettings не готовий", {
        hasInitialSettings: !!initialSettings.current,
        initialSettingsReady
      });
      return {};
    }

    const currentSettings = getCurrentSettings();
    const changes: any = {};

    console.log("Поточні налаштування:", currentSettings);
    console.log("Початкові налаштування:", initialSettings.current);

    // Порівнюємо кожне поле з початковим значенням
    Object.keys(currentSettings).forEach((key) => {
      const currentValue = currentSettings[key as keyof SettingsState];
      const initialValue = initialSettings.current![key as keyof SettingsState];

      if (currentValue !== initialValue) {
        console.log(`Поле ${key} змінилось: ${initialValue} -> ${currentValue}`);

        // Маппінг полів до API формату
        switch (key) {
          case 'username':
            changes.name = currentValue;
            break;
          case 'about':
            changes.description = currentValue;
            break;
          case 'birthdate':
            changes.birthday = currentValue || null;
            break;
          case 'gender':
            changes.gender = currentValue;
            break;
          case 'contentRestriction':
            changes.allow_adult = currentValue === "18+";
            break;
          case 'isAutoNext':
            changes.is_auto_next = currentValue;
            break;
          case 'isAutoPlay':
            changes.is_auto_play = currentValue;
            break;
          case 'isAutoSkipIntro':
            changes.is_auto_skip_intro = currentValue;
            break;
          case 'isPrivateFavorites':
            changes.is_private_favorites = currentValue;
            break;

          // OLD notification fields
          case 'commentReply':
            changes.notify_comment_replies = currentValue;
            break;
          case 'commentMention':
            changes.notify_comment_likes = currentValue;
            break;
          case 'commentInCollection':
            changes.notify_review_replies = currentValue;
            break;
          case 'commentInEdit':
            changes.notify_planned_reminders = currentValue;
            break;
          case 'commentRating':
            changes.notify_new_selections = currentValue;
            break;
          case 'collectionRating':
            changes.notify_status_changes = currentValue;
            break;
          case 'editAccepted':
            changes.notify_new_seasons = currentValue;
            break;
          case 'editRejected':
            changes.notify_subscription_expiration = currentValue;
            break;
          case 'animeUpdate':
            changes.notify_new_episodes = currentValue;
            break;
          case 'myAnime':
            changes.notify_episode_date_changes = currentValue;
            break;
          case 'userFollow':
            changes.notify_announcement_to_ongoing = currentValue;
            break;
          case 'system':
            changes.notify_site_updates = currentValue;
            changes.notify_maintenance = currentValue;
            changes.notify_security_changes = currentValue;
            break;

          // NEW notification fields
          case 'newEpisodes':
            changes.notify_new_episodes = currentValue;
            break;
          case 'episodeDateChanges':
            changes.notify_episode_date_changes = currentValue;
            break;
          case 'announcementToOngoing':
            changes.notify_announcement_to_ongoing = currentValue;
            break;
          case 'commentReplies':
            changes.notify_comment_replies = currentValue;
            break;
          case 'commentLikes':
            changes.notify_comment_likes = currentValue;
            break;
          case 'reviewReplies':
            changes.notify_review_replies = currentValue;
            break;
          case 'plannedReminders':
            changes.notify_planned_reminders = currentValue;
            break;
          case 'newSelections':
            changes.notify_new_selections = currentValue;
            break;
          case 'statusChanges':
            changes.notify_status_changes = currentValue;
            break;
          case 'newSeasons':
            changes.notify_new_seasons = currentValue;
            break;
          case 'subscriptionExpiration':
            changes.notify_subscription_expiration = currentValue;
            break;
          case 'subscriptionRenewal':
            changes.notify_subscription_renewal = currentValue;
            break;
          case 'paymentIssues':
            changes.notify_payment_issues = currentValue;
            break;
          case 'tariffChanges':
            changes.notify_tariff_changes = currentValue;
            break;
          case 'siteUpdates':
            changes.notify_site_updates = currentValue;
            break;
          case 'maintenance':
            changes.notify_maintenance = currentValue;
            break;
          case 'securityChanges':
            changes.notify_security_changes = currentValue;
            break;
          case 'newFeatures':
            changes.notify_new_features = currentValue;
            break;
        }
      }
    });

    console.log("Знайдені зміни:", changes);
    return changes;
  };

  // Fetch user settings function
  const fetchUserSettings = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);

      const authenticatedFetch = createAuthenticatedFetch(token);
      const response = await authenticatedFetch(`${API_BASE_URL}settings`);

      if (response.ok) {
        const data = await response.json();
        const settings = data.data as UserSettings;
        setUserSettings(settings);

        console.log("Отримані налаштування з сервера:", settings);

        // Map backend data to local state
        setUsername(settings.name || "");
        setEmail(settings.email || "");
        setAvatar(settings.avatar || "/default-avatar.png");
        setCover(settings.backdrop || "");
        setNickname(settings.name || "");
        setAbout(settings.description || "");
        setBirthdate(settings.birthday || "");
        setGender(settings.gender || "");

        // Player preferences
        setAllowAdult(settings.allow_adult);
        setIsAutoNext(settings.is_auto_next);
        setIsAutoPlay(settings.is_auto_play);
        setIsAutoSkipIntro(settings.is_auto_skip_intro);
        setIsPrivateFavorites(settings.is_private_favorites);

        // Content restriction mapping
        const restriction = settings.allow_adult ? "18+" : "16+";
        setContentRestriction(restriction);

        // OLD notification settings mapping (для сумісності)
        setCommentReply(settings.notify.comment_replies);
        setCommentMention(settings.notify.comment_likes);
        setCommentInCollection(settings.notify.review_replies);
        setCommentInEdit(settings.notify.planned_reminders);
        setCommentRating(settings.notify.new_selections);
        setCollectionRating(settings.notify.status_changes);
        setEditAccepted(settings.notify.new_seasons);
        setEditRejected(settings.notify.subscription_expiration);
        setAnimeUpdate(settings.notify.new_episodes);
        setMyAnime(settings.notify.episode_date_changes);
        setUserFollow(settings.notify.announcement_to_ongoing);
        setSystem(settings.notify.site_updates || settings.notify.maintenance || settings.notify.security_changes);

        // NEW notification settings mapping (для нового інтерфейсу)
        setNewEpisodes(settings.notify.new_episodes);
        setEpisodeDateChanges(settings.notify.episode_date_changes);
        setAnnouncementToOngoing(settings.notify.announcement_to_ongoing);
        setCommentReplies(settings.notify.comment_replies);
        setCommentLikes(settings.notify.comment_likes);
        setReviewReplies(settings.notify.review_replies);
        setPlannedReminders(settings.notify.planned_reminders);
        setNewSelections(settings.notify.new_selections);
        setStatusChanges(settings.notify.status_changes);
        setNewSeasons(settings.notify.new_seasons);
        setSubscriptionExpiration(settings.notify.subscription_expiration);
        setSubscriptionRenewal(settings.notify.subscription_renewal);
        setPaymentIssues(settings.notify.payment_issues);
        setTariffChanges(settings.notify.tariff_changes);
        setSiteUpdates(settings.notify.site_updates);
        setMaintenance(settings.notify.maintenance);
        setSecurityChanges(settings.notify.security_changes);
        setNewFeatures(settings.notify.new_features);

        // Зберігаємо початкові значення для порівняння
        // Використовуємо більший таймаут та перевіряємо готовність
        setTimeout(() => {
          console.log("Спроба ініціалізації initialSettings...");
          console.log("Current notification states:", {
            newEpisodes,
            episodeDateChanges,
            announcementToOngoing,
            commentReplies,
            commentLikes,
            reviewReplies,
            plannedReminders,
            newSelections,
            statusChanges,
            newSeasons,
            subscriptionExpiration,
            subscriptionRenewal,
            paymentIssues,
            tariffChanges,
            siteUpdates,
            maintenance,
            securityChanges,
            newFeatures,
          });

          const initialState: SettingsState = {
            username: settings.name || "",
            about: settings.description || "",
            birthdate: settings.birthday || "",
            gender: settings.gender || "",
            contentRestriction: restriction,
            isAutoNext: settings.is_auto_next,
            isAutoPlay: settings.is_auto_play,
            isAutoSkipIntro: settings.is_auto_skip_intro,
            isPrivateFavorites: settings.is_private_favorites,

            // OLD notification fields
            commentReply: settings.notify.comment_replies,
            commentMention: settings.notify.comment_likes,
            commentInCollection: settings.notify.review_replies,
            commentInEdit: settings.notify.planned_reminders,
            commentRating: settings.notify.new_selections,
            collectionRating: settings.notify.status_changes,
            editAccepted: settings.notify.new_seasons,
            editRejected: settings.notify.subscription_expiration,
            animeUpdate: settings.notify.new_episodes,
            myAnime: settings.notify.episode_date_changes,
            userFollow: settings.notify.announcement_to_ongoing,
            system: settings.notify.site_updates || settings.notify.maintenance || settings.notify.security_changes,

            // NEW notification fields - використовуємо значення з response
            newEpisodes: settings.notify.new_episodes,
            episodeDateChanges: settings.notify.episode_date_changes,
            announcementToOngoing: settings.notify.announcement_to_ongoing,
            commentReplies: settings.notify.comment_replies,
            commentLikes: settings.notify.comment_likes,
            reviewReplies: settings.notify.review_replies,
            plannedReminders: settings.notify.planned_reminders,
            newSelections: settings.notify.new_selections,
            statusChanges: settings.notify.status_changes,
            newSeasons: settings.notify.new_seasons,
            subscriptionExpiration: settings.notify.subscription_expiration,
            subscriptionRenewal: settings.notify.subscription_renewal,
            paymentIssues: settings.notify.payment_issues,
            tariffChanges: settings.notify.tariff_changes,
            siteUpdates: settings.notify.site_updates,
            maintenance: settings.notify.maintenance,
            securityChanges: settings.notify.security_changes,
            newFeatures: settings.notify.new_features,
          };

          initialSettings.current = initialState;
          console.log("Initial settings ВСТАНОВЛЕНО:", initialSettings.current);
          setInitialSettingsReady(true); // Повідомляємо, що ініціалізація завершена
        }, 500); // Збільшуємо таймаут
      } else {
        setError("Не вдалося завантажити налаштування");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  };

  // Функція для перевірки наявності змін (включаючи файли)
  const hasChanges = () => {
    if (!initialSettingsReady) {
      console.log("hasChanges: initialSettings ще не готовий");
      return false;
    }

    const changes = getChangedFields();
    const hasFieldChanges = Object.keys(changes).length > 0;
    const hasFileChanges = pendingAvatarFile || pendingCoverFile;

    console.log("hasChanges перевірка:", {
      hasFieldChanges,
      hasFileChanges,
      changesCount: Object.keys(changes).length,
      pendingAvatarFile: !!pendingAvatarFile,
      pendingCoverFile: !!pendingCoverFile,
      initialSettingsReady
    });

    return hasFieldChanges || hasFileChanges;
  };

  // useEffect для ініціалізації
  useEffect(() => {
    if (initialSettingsReady) {
      console.log("🎯 initialSettings ініціалізовано та готовий до використання!");
      console.log("Перевіряємо hasChanges одразу після ініціалізації:", hasChanges());

      // Тестуємо getCurrentSettings
      const current = getCurrentSettings();
      console.log("getCurrentSettings результат:", current);
      console.log("initialSettings.current:", initialSettings.current);
    }
  }, [initialSettingsReady]);

  // useEffect для відстеження змін
  useEffect(() => {
    console.log("useEffect спрацював! initialSettingsReady:", initialSettingsReady);
    if (initialSettingsReady && initialSettings.current) {
      const changes = hasChanges();
      console.log("Стан змін після оновлення:", changes);

      // Додаткове логування для конкретних полів нотифікацій
      console.log("Приклад перевірки newEpisodes:", {
        current: newEpisodes,
        initial: initialSettings.current.newEpisodes,
        changed: newEpisodes !== initialSettings.current.newEpisodes
      });
    } else {
      console.log("initialSettings ще не готовий");
    }
  }, [
    // Додаємо initialSettingsReady до залежностей
    initialSettingsReady,
    // Всі поля, які можуть змінюватися
    username, about, birthdate, gender, contentRestriction,
    isAutoNext, isAutoPlay, isAutoSkipIntro, isPrivateFavorites,
    commentReply, commentMention, commentInCollection, commentInEdit,
    commentRating, collectionRating, editAccepted, editRejected,
    animeUpdate, myAnime, userFollow, system,
    newEpisodes, episodeDateChanges, announcementToOngoing,
    commentReplies, commentLikes, reviewReplies, plannedReminders,
    newSelections, statusChanges, newSeasons, subscriptionExpiration,
    subscriptionRenewal, paymentIssues, tariffChanges, siteUpdates,
    maintenance, securityChanges, newFeatures,
    pendingAvatarFile, pendingCoverFile
  ]);

  // API call effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (mounted && isAuthenticated && token) {
      fetchUserSettings();
    }
  }, [mounted, isAuthenticated, token]);

  // Save settings function
  const saveSettings = async () => {
    if (!isAuthenticated || !token) return;

    const changes = getChangedFields();
    const hasFiles = pendingAvatarFile || pendingCoverFile;

    // Якщо немає змін і немає файлів, не робимо запит
    if (Object.keys(changes).length === 0 && !hasFiles) {
      console.log("Немає змін для збереження");
      return;
    }

    console.log("Зміни для збереження:", changes);
    console.log("Файли для завантаження:", {
      avatar: pendingAvatarFile?.name,
      cover: pendingCoverFile?.name
    });

    try {
      setSaving(true);
      setError(null);

      const authenticatedFetch = createAuthenticatedFetch(token);

      // Використовуємо FormData якщо є файли, інакше JSON
      if (hasFiles) {
        const formData = new FormData();

        // Додаємо зміни як окремі поля
        Object.entries(changes).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });

        // Додаємо файли з правильними назвами
        if (pendingAvatarFile) {
          const fileExtension = pendingAvatarFile.name.split('.').pop();
          const avatarFile = new File([pendingAvatarFile], `${userSettings?.id}.${fileExtension}`, {
            type: pendingAvatarFile.type
          });
          formData.append("avatar", avatarFile);
        }
        if (pendingCoverFile) {
          const fileExtension = pendingCoverFile.name.split('.').pop();
          const backdropFile = new File([pendingCoverFile], `${userSettings?.id}_backdrop.${fileExtension}`, {
            type: pendingCoverFile.type
          });
          formData.append("backdrop", backdropFile);
        }

        const response = await authenticatedFetch(`${API_BASE_URL}settings`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Успішно збережено з файлами:", data);

          // Оновлюємо URL з відповіді сервера
          if (pendingAvatarFile && (data.avatar || data.data?.avatar)) {
            setAvatar(data.avatar || data.data.avatar);
          }
          if (pendingCoverFile && (data.backdrop || data.data?.backdrop)) {
            setCover(data.backdrop || data.data.backdrop);
          }

          // Очищуємо pending файли
          setPendingAvatarFile(null);
          setPendingCoverFile(null);

          // Оновлюємо початкові значення
          initialSettings.current = getCurrentSettings();

        } else {
          const errorData = await response.text();
          console.error("Помилка збереження з файлами:", errorData);
          setError("Не вдалося зберегти налаштування");
        }
      } else {
        // Звичайний JSON запит без файлів
        const response = await authenticatedFetch(`${API_BASE_URL}settings`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(changes),
        });

        if (response.ok) {
          console.log("Налаштування успішно збережені");
          // Оновлюємо початкові значення після успішного збереження
          initialSettings.current = getCurrentSettings();
        } else {
          const errorData = await response.text();
          console.error("Помилка збереження:", errorData);
          setError("Не вдалося зберегти налаштування");
        }
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  // Avatar upload function
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл аватара вибрано:", file.name, file.size);
      setPendingAvatarFile(file);

      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
    }
  };

  // Cover upload function
  const handleCoverUpload = async (file: File) => {
    console.log("Файл обкладинки вибрано:", file.name, file.size);
    setPendingCoverFile(file);

    // Показуємо превью
    const previewUrl = URL.createObjectURL(file);
    setCover(previewUrl);
  };

  // Функція для скасування файлів
  const cancelFileUploads = () => {
    if (pendingAvatarFile) {
      setPendingAvatarFile(null);
      // Повертаємо оригінальний аватар
      setAvatar(userSettings?.avatar || "/default-avatar.png");
    }
    if (pendingCoverFile) {
      setPendingCoverFile(null);
      // Повертаємо оригінальну обкладинку
      setCover(userSettings?.backdrop || "");
    }
  };

  // Render guards
  if (!mounted || typeof window === 'undefined') {
    return (
      <div className="flex w-full min-h-screen bg-transparent items-center justify-center">
        <div className="text-white text-xl">Ініціалізація...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex w-full min-h-screen bg-transparent items-center justify-center">
        <div className="text-white text-xl">Необхідно увійти в систему</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex w-full min-h-screen bg-transparent items-center justify-center">
        <div className="text-white text-xl">Завантаження налаштувань...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full min-h-screen bg-transparent items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="flex w-full min-h-screen bg-transparent"
      suppressHydrationWarning={true}
    >
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col lg:flex-row gap-16 px-4 md:px-8 pt-6 lg:pt-12 pb-16 w-full">
        {activeTab === 0 && (
          <SettingsPreferencesTab
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            gender={gender}
            setGender={setGender}
            allow_adult={allowAdult}
            setAllowAdult={setAllowAdult}
            is_auto_next={isAutoNext}
            setIsAutoNext={setIsAutoNext}
            is_auto_play={isAutoPlay}
            setIsAutoPlay={setIsAutoPlay}
            is_auto_skip_intro={isAutoSkipIntro}
            setIsAutoSkipIntro={setIsAutoSkipIntro}
            is_private_favorites={isPrivateFavorites}
            setIsPrivateFavorites={setIsPrivateFavorites}
          />
        )}
        {activeTab === 1 && (
          <SettingsProfileTab
            username={username}
            setUsername={setUsername}
            avatar={avatar}
            setAvatar={setAvatar}
            nickname={nickname}
            setNickname={setNickname}
            about={about}
            setAbout={setAbout}
            location={location}
            setLocation={setLocation}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            gender={gender}
            setGender={setGender}
            cover={cover}
            setCover={setCover}
            handleAvatarUpload={handleAvatarUpload}
            handleCoverUpload={handleCoverUpload}
            pendingAvatarFile={pendingAvatarFile}
            pendingCoverFile={pendingCoverFile}
            userSettings={userSettings}
          />
        )}
        {activeTab === 2 && (
          <SettingsSecurityTab
            email={email}
            setEmail={setEmail}
            emailConfirm={emailConfirm}
            setEmailConfirm={setEmailConfirm}
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
          />
        )}
        {activeTab === 3 && (
          <SettingsNotificationsTab
            newEpisodes={newEpisodes}
            setNewEpisodes={setNewEpisodes}
            episodeDateChanges={episodeDateChanges}
            setEpisodeDateChanges={setEpisodeDateChanges}
            announcementToOngoing={announcementToOngoing}
            setAnnouncementToOngoing={setAnnouncementToOngoing}
            commentReplies={commentReplies}
            setCommentReplies={setCommentReplies}
            commentLikes={commentLikes}
            setCommentLikes={setCommentLikes}
            reviewReplies={reviewReplies}
            setReviewReplies={setReviewReplies}
            plannedReminders={plannedReminders}
            setPlannedReminders={setPlannedReminders}
            newSelections={newSelections}
            setNewSelections={setNewSelections}
            statusChanges={statusChanges}
            setStatusChanges={setStatusChanges}
            newSeasons={newSeasons}
            setNewSeasons={setNewSeasons}
            subscriptionExpiration={subscriptionExpiration}
            setSubscriptionExpiration={setSubscriptionExpiration}
            subscriptionRenewal={subscriptionRenewal}
            setSubscriptionRenewal={setSubscriptionRenewal}
            paymentIssues={paymentIssues}
            setPaymentIssues={setPaymentIssues}
            tariffChanges={tariffChanges}
            setTariffChanges={setTariffChanges}
            siteUpdates={siteUpdates}
            setSiteUpdates={setSiteUpdates}
            maintenance={maintenance}
            setMaintenance={setMaintenance}
            securityChanges={securityChanges}
            setSecurityChanges={setSecurityChanges}
            newFeatures={newFeatures}
            setNewFeatures={setNewFeatures}
          />
        )}
        {activeTab !== 0 &&
          activeTab !== 1 &&
          activeTab !== 2 &&
          activeTab !== 3 && (
            <section className="flex-1 flex items-center justify-center text-white text-2xl font-bold">
              {navItems[activeTab]?.label || "Розділ"}
            </section>
          )}

        <div className="fixed bottom-8 right-8 z-50 flex gap-3">
          {(pendingAvatarFile || pendingCoverFile) && (
            <button
              onClick={cancelFileUploads}
              className="px-4 py-3 rounded-xl font-medium text-white bg-gray-600 hover:bg-gray-700 transition-all duration-200"
            >
              Скасувати файли
            </button>
          )}
          <button
            onClick={saveSettings}
            disabled={saving || !hasChanges()}
            className={`
              px-6 py-3 rounded-xl font-medium text-white transition-all duration-200
              ${saving
                ? "bg-gray-500 cursor-not-allowed"
                : hasChanges()
                  ? "bg-[#4B7FCC] hover:bg-[#3c70bd] hover:scale-105"
                  : "bg-gray-500 cursor-not-allowed"
              }
            `}
          >
            {saving
              ? "Збереження..."
              : hasChanges()
                ? `Зберегти ${(pendingAvatarFile || pendingCoverFile) ? "(з файлами)" : "зміни"}`
                : "Немає змін"
            }
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsMenu;
