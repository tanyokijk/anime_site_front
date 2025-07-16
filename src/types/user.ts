// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  avatar: string;
  backdrop: string;
  description: string;
  birthday: string;
  allow_adult: boolean;
  is_auto_next: boolean;
  is_auto_play: boolean;
  is_auto_skip_intro: boolean;
  is_private_favorites: boolean;
  is_banned: boolean;
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
  email_verified_at: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
  list_counts: {
    watching: number;
    planned: number;
    watched: number;
    stopped: number;
    rewatching: number;
  };
  favorite_animes: FavoriteAnime[];
  favorite_people: FavoritePerson[];
  ratings_count: number;
  comments_count: number;
  subscriptions_count: number;
  achievements_count: number;
  watch_time: {
    total_hours: number;
    total_days: number;
    total_months: number;
    hours_by_month: Record<string, number>;
  };
  age: number;
  is_online: boolean;
  formatted_last_seen: string;
  last_watched_episodes?: WatchedEpisode[];
}
export interface WatchedEpisode {
  id: string;
  progress_time: number;
  watched_at: string;
  episode: {
    id: string;
    name: string;
    number: number;
    air_date: string;
    anime: {
      id: string;
      name: string;
      poster: string;
    };
  };
}
export interface FavoriteAnime {
  id: string;
  title: string;
  poster: string;
  year: string;
  kind: string;
}

export interface FavoritePerson {
  id: string;
  name: string;
  poster: string | null;
  year: string | null;
  type: string | null;
}

export interface UserApiResponse {
  data: User;
}
