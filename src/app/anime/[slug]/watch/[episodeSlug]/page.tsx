"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "../../../../../components/anime-page/VideoPlayer";
import PlayerSettings from "../../../../../components/anime-page/player-settings";

interface VoiceoverOption {
  id: string;
  name: string;
}

interface PlayerOption {
  id: string;
  name: string;
}

interface AnimeInfo {
  title: string;
  description?: string;
  year?: string | number;
  genres?: string[];
}

interface Episode {
  id: string;
  slug: string;
  number: number;
  name: string;
  full_name: string;
}

interface VideoPlayer {
  file_url: string;
  voiceover_team_id: string;
  voiceover_team?: {
    id: string;
    name: string;
  };
  player_name?: string;
}

interface EpisodeData {
  id: string;
  slug: string;
  number: number;
  name: string;
  full_name: string;
  description: string;
  duration: number;
  formatted_duration: string;
  air_date: string | null;
  is_filler: boolean;
  pictures_url: string[];
  video_players: VideoPlayer[];
  comments_count: number;
  created_at: string;
  updated_at: string;
  seo: {
    meta_title: string;
    meta_description: string | null;
    meta_image: string | null;
  };
  anime: {
    id: string;
    slug: string;
    name: string;
    description: string;
    imdb_score?: number;
    year: string;
    tags: string[];
  };
}

function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const episodeSlug = params?.episodeSlug as string;
  const animeSlug = params?.slug as string;

  const [data, setData] = useState<EpisodeData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLightOn, setIsLightOn] = useState(true);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [activeVoiceover, setActiveVoiceover] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!episodeSlug || !animeSlug) {
        setError("Відсутні параметри епізоду або аніме");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setEpisodesLoading(true);
        setError(null);

        console.log("Завантаження епізоду:", episodeSlug);
        console.log("Завантаження списку епізодів для:", animeSlug);

        const [episodeRes, episodesRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/v1/episodes/${episodeSlug}`),
          fetch(`http://127.0.0.1:8000/api/v1/animes/${animeSlug}/episodes`),
        ]);

        // Обробити дані епізоду
        if (!episodeRes.ok) {
          throw new Error(`Помилка завантаження епізоду: ${episodeRes.status}`);
        }

        const episodeJson = await episodeRes.json();
        console.log("Отримані дані епізоду:", episodeJson);
        
        const episodeData = episodeJson.data as EpisodeData;
        
        // Перевірка структури даних
        if (!episodeData) {
          throw new Error("Дані епізоду відсутні");
        }

        // Валідація video_players
        if (!episodeData.video_players) {
          console.warn("video_players відсутній, встановлюємо пустий масив");
          episodeData.video_players = [];
        } else if (!Array.isArray(episodeData.video_players)) {
          console.warn("video_players не є масивом:", episodeData.video_players);
          episodeData.video_players = [];
        }

        setData(episodeData);

        // Встановити початкові значення для плеєра і озвучки
        if (episodeData.video_players.length > 0) {
          const firstPlayer = episodeData.video_players[0];
          setActivePlayer(firstPlayer.file_url);
          setActiveVoiceover(firstPlayer.voiceover_team_id);
          console.log("Встановлено активний плеєр:", firstPlayer.file_url);
        } else {
          console.warn("Відео плеєри відсутні для цього епізоду");
        }

        // Обробити список епізодів
        if (episodesRes.ok) {
          const episodesJson = await episodesRes.json();
          console.log("Отримані епізоди:", episodesJson);
          
          if (episodesJson.data && Array.isArray(episodesJson.data)) {
            setEpisodes(episodesJson.data as Episode[]);
          } else {
            console.warn("Список епізодів не є масивом або відсутній");
            setEpisodes([]);
          }
        } else {
          console.error("Помилка завантаження списку епізодів:", episodesRes.status);
          setEpisodes([]);
        }

      } catch (err) {
        console.error("Failed to fetch data", err);
        setError(err instanceof Error ? err.message : "Помилка завантаження");
      } finally {
        setLoading(false);
        setEpisodesLoading(false);
      }
    }

    fetchData();
  }, [episodeSlug, animeSlug]);

  const handlePlayerChange = (playerUrl: string) => {
    console.log("Зміна плеєра на:", playerUrl);
    setActivePlayer(playerUrl);
    
    // Знайти відповідну озвучку для вибраного плеєра
    if (data?.video_players && Array.isArray(data.video_players)) {
      const selectedPlayerData = data.video_players.find(
        (player) => player.file_url === playerUrl
      );
      
      if (selectedPlayerData) {
        setActiveVoiceover(selectedPlayerData.voiceover_team_id);
        console.log("Встановлено озвучку:", selectedPlayerData.voiceover_team_id);
      }
    }
  };

  const handleVoiceoverChange = (voiceoverId: string) => {
    console.log("Зміна озвучки на:", voiceoverId);
    setActiveVoiceover(voiceoverId);
    
    // Знайти відповідний file_url для вибраної озвучки
    if (data?.video_players && Array.isArray(data.video_players)) {
      const selectedPlayer = data.video_players.find(
        (player) => player.voiceover_team_id === voiceoverId
      );
      
      if (selectedPlayer) {
        setActivePlayer(selectedPlayer.file_url);
        console.log("Встановлено плеєр:", selectedPlayer.file_url);
      }
    }
  };

  const handleEpisodeClick = (episode: Episode) => {
    router.push(`/anime/${animeSlug}/watch/${episode.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Завантаження епізоду...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Епізод не знайдено</div>
      </div>
    );
  }

  // Безпечне створення унікальних списків плеєрів та озвучок
  const videoPlayers = data.video_players || [];
  
  const players: PlayerOption[] = videoPlayers
    .map((vp, index) => ({ 
      id: vp.file_url, 
      name: vp.player_name || `Плеєр ${index + 1}`
    }))
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  const voiceovers: VoiceoverOption[] = videoPlayers
    .map((vp) => ({ 
      id: vp.voiceover_team_id, 
      name: vp.voiceover_team?.name || `Озвучка ${vp.voiceover_team_id}`
    }))
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  console.log("Доступні плеєри:", players);
  console.log("Доступні озвучки:", voiceovers);

  return (
    <div className="min-h-screen px-2 xs:px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-16 relative">
      <div
        className={`fixed inset-0 bg-black z-10 pointer-events-none transition-opacity duration-500 ease-in-out ${
          isLightOn ? "opacity-80" : "opacity-0"
        }`}
      />
      <div className="flex flex-row w-full gap-6 relative">
        <div className="flex flex-col items-center w-full lg:w-3/4 relative">
          {/* Заголовок епізоду */}
          <div className="w-full mb-4 text-center lg:text-left">
            <h1 className="text-white text-2xl font-bold mb-2">
              {data.full_name || `Епізод ${data.number}: ${data.name}`}
            </h1>
            {data.description && (
              <p className="text-gray-300 text-sm mb-2">{data.description}</p>
            )}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-400">
              <span>Епізод {data.number}</span>
              {data.formatted_duration && (
                <>
                  <span>•</span>
                  <span>{data.formatted_duration}</span>
                </>
              )}
              {data.air_date && (
                <>
                  <span>•</span>
                  <span>{new Date(data.air_date).toLocaleDateString('uk-UA')}</span>
                </>
              )}
              {data.is_filler && (
                <>
                  <span>•</span>
                  <span className="text-yellow-500">Філер</span>
                </>
              )}
            </div>
          </div>

          {/* Відео плеєр */}
          {activePlayer ? (
            <VideoPlayer 
              url={activePlayer} 
              isLightOn={isLightOn} 
              setIsLightOn={setIsLightOn} 
            />
          ) : (
            <div className="w-full aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-xl mb-2">Відео недоступне</p>
                <p className="text-gray-400">Плеєри не знайдені для цього епізоду</p>
              </div>
            </div>
          )}

          {/* Налаштування плеєра */}
          <PlayerSettings
            isLightOn={isLightOn}
            setIsLightOn={setIsLightOn}
            episode={data.number}
            players={players}
            voiceovers={voiceovers}
            activePlayer={activePlayer}
            activeVoiceover={activeVoiceover}
            onPlayerChange={handlePlayerChange}
            onVoiceoverChange={handleVoiceoverChange}
          />

          {/* Debug інформація (тільки в development) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="w-full mt-4 p-4 bg-gray-800 rounded-lg text-xs">
              <h4 className="text-white font-semibold mb-2">Debug Info:</h4>
              <pre className="text-gray-300 overflow-auto max-h-40">
                {JSON.stringify({
                  activePlayer,
                  activeVoiceover,
                  playersCount: players.length,
                  voiceoversCount: voiceovers.length,
                  videoPlayersCount: videoPlayers.length,
                  hasVideoPlayers: !!data.video_players,
                  isVideoPlayersArray: Array.isArray(data.video_players)
                }, null, 2)}
              </pre>
            </div>
          )} */}
        </div>

        {/* Бічна панель */}
        <div className="hidden lg:flex flex-col w-1/4 gap-6">
          {/* Інформація про аніме */}
          <div className="bg-[#181A20] rounded-xl p-5 shadow-md">
            <div className="text-white text-xl font-bold mb-2">{data.anime?.name}</div>
            <div className="flex items-center gap-3 mb-2 text-sm text-gray-400">
              <span>{data.anime?.year || "—"}</span>
              <span>•</span>
              <span>{data.anime?.tags?.join(", ") || "—"}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                  fill="#FACC15"
                />
              </svg>
              <span className="text-white font-semibold text-sm">{data.anime?.imdb_score || "N/A"}</span>
              <span className="text-gray-400 text-xs">IMDB</span>
            </div>
            <div className="text-gray-300 text-sm leading-snug line-clamp-5">{data.anime?.description}</div>
          </div>

          {/* Список епізодів */}
          <div className="bg-[#181A20] rounded-xl p-5 shadow-md">
            <div className="text-white text-lg font-bold mb-4">Епізоди</div>
            
            {episodesLoading ? (
              <div className="text-gray-400 text-sm">Завантаження епізодів...</div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-6 gap-1.5 max-h-80 overflow-y-auto">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => handleEpisodeClick(episode)}
                    className={`
                      aspect-square rounded-md text-xs font-medium transition-all duration-200 hover:scale-105 min-h-[32px]
                      ${data.number === episode.number 
                        ? "bg-blue-500 text-white" 
                        : "bg-[#23262F] text-gray-300 hover:bg-[#2A2E38] hover:text-white"
                      }
                    `}
                    title={episode.full_name || `Епізод ${episode.number}`}
                  >
                    {episode.number}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Епізоди не знайдено</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchPage;