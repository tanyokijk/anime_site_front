"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/nav/navbar";
import AnimeCarousel from "@/components/main-page/Carousel/anime-carousel";
import CardCollection from "@/components/main-page/card-collection";
import TopAnimeList from "@/components/main-page/TopAnimeList/top-anime-list";
import CommentCollection from "@/components/main-page/comment-collection";
import TopUserList from "@/components/main-page/top-user-list";
import ContinueWatchingCard from "../components/main-page/continue-watching-card";
import GenreCard from "@/components/main-page/genre-card";
import ReleaseCard from "@/components/main-page/release-card";
import CustomCollectionSection from "@/components/main-page/CustomCollectionSection/custom-collection-section";
import ReviewCard from "@/components/main-page/ReviewSection/review-card";
import ReviewSection from "@/components/main-page/ReviewSection/review-section";

interface Anime {
  id: string;
  name: string;
  poster: string;
  imdb_score: number;
  duration?: number;
  rank?: number;
  related_seasons_count?: number;
  first_air_date: string;
  kind: string;
  year: number;
  slug: string; // Додано slug для навігації
  description?: string;
}
interface Episode {
  id: string;
  anime_id: string;
  anime_name: string;
  air_date: string;
  month: string;
  number: number;
  slug: string;
  anime_poster: string;
}
interface AnimeShort {
  poster: string;
}

interface Comment {
  user_name: string;
  user_avatar: string;
  created_at: string;
  text?: string;
  title: string;
  url:string;
  type:string;
}
interface User {
  id: string;
  avatar: string;
  name: string;
  created_at: string;
  comments_count: number;
  achievements_count: number;
  rank: number;
}

interface Tag {
  name: string;
  description: string;
  slug:string;
  animes: AnimeShort[];
}

interface Review {
  user_name: string;
  review_date: string;
  anime_name: string;
  number: number;
  review: string;
} 

interface HomeData {
  five_anime: Anime[];
  popular_now: Anime[];
  continue_watching: Anime[];
  top_10: Anime[];
  latest_comments: Comment[];
  new_animes: Anime[];
  top_users:User[];
  release_calendar: Episode[];
  top_ongoings: Anime[];
  soon: Anime[];
  genres: Tag[];
  tags: Tag[];
  latest_reviews: Review[];
  recommended: Anime[];

  // додай інші поля, якщо треба (top_10, latest_comments, тощо)
}


export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_BASE_URL);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Завантаження...</div>;
  if (!data) return <div className="p-4">Помилка завантаження</div>;
  const groupedByMonth = data.release_calendar.reduce((acc, episode) => {
    if (!acc[episode.month]) {
      acc[episode.month] = [];
    }
    acc[episode.month].push(episode);
    return acc;
  }, {} as Record<string, typeof data.release_calendar>);

  return (
    <div className="p-0 m-0 font-[family-name:var(--font-geist-sans)]">

      <AnimeCarousel 
  slides={data.five_anime.map
  (anime => ({
    id: anime.id,
    name: anime.name,
    description: anime.description || "",
    poster: anime.poster,
    related_seasons_count: anime.related_seasons_count || 0,
    slug: anime.slug
  }))
  } 
  loading={loading}
  error={null}
/>

      {Array.isArray(data.recommended) && data.recommended.length > 0 && (
      <CardCollection
        title="Продовжуйте дивитись"
        items={data.continue_watching.map((anime) => ({
          id: anime.id,
          title: anime.name,
          image: anime.poster,
          imdbRating: anime.imdb_score,
          duration: anime.duration,
          seasons:anime.related_seasons_count,
          slug: anime.slug
        }))}
        cardType="continue-watching"
        showButton={true}
        buttonText="Переглянути весь список"
        buttonUrl="/continue-watching"
      />
      )}

       <CardCollection
        title="Популярне зараз"
        items={data.popular_now.map((anime) => ({
          id: anime.id,
          title: anime.name,
          image: anime.poster,
          imdbRating: anime.imdb_score,
          duration: anime.duration,
          seasons:anime.related_seasons_count,
          slug: anime.slug,
        }))}
        cardType="anime"
      />

      <CardCollection
        title="Скоро на сайті"
        items={data.soon.map((anime) => ({
          id: anime.id,
          title: anime.name,
          image: anime.poster,
          imdbRating: anime.imdb_score,
          duration: anime.duration,
          seasons:anime.related_seasons_count,
          slug: anime.slug,
        }))}
        cardType="anime"
        showButton={true}
        buttonText="Переглянути всі анонси"
        buttonUrl="/anonce"
      />

      <TopAnimeList items=
      {data.top_10} showRank={false} />

      <CommentCollection comments={data.latest_comments} />

      <CardCollection title="Новинки"
        items={data.popular_now.map((anime) => ({
          id: anime.id,
          title: anime.name,
          image: anime.poster,
          imdbRating: anime.imdb_score,
          duration: anime.duration,
          seasons:anime.related_seasons_count,
          slug: anime.slug,
        }))}
        cardType="anime"
      />

      <TopUserList users={data.top_users} />

      <section className="relative">
    <h1 className="text-white text-2xl font-bold pl-6.5">
      Календар релізів
    </h1>

    {Object.entries(groupedByMonth).map(([month, episodes]) => (
      <CardCollection
        key={month}
        items={episodes.map((episode) => ({
          id: episode.id,
          anime_id: episode.anime_id,
          anime_name: episode.anime_name,
          air_date: episode.air_date,
          month: episode.month,
          number: episode.number,
          slug: episode.slug,
          anime_poster: episode.anime_poster,
        }))}
        cardType="release"
        title={month}
        showButton={false}
      />
    ))}
  </section>

      <CardCollection
        title="Топ онґоінґи"
        items={data.top_ongoings.map((anime) => ({
          id: anime.id,
          title: anime.name,
          image: anime.poster,
          imdbRating: anime.imdb_score,
          duration: anime.duration,
          seasons:anime.related_seasons_count,
          slug: anime.slug,
        }))}
        cardType="anime"
      />

{Array.isArray(data.recommended) && data.recommended.length > 0 && (
  <CardCollection
    title="Рекомендації для вас"
    items={data.recommended.map((anime) => ({
      id: anime.id,
      title: anime.name,
      image: anime.poster,
      imdbRating: anime.imdb_score,
      duration: anime.duration,
      seasons: anime.related_seasons_count,
      slug: anime.slug,
    }))}
    cardType="anime"
  />
)}

      <CardCollection
        title="Жанри сайту"
        items={data.genres.map((genre) => ({
          name: genre.name,
          description: genre.description,
          slug: genre.slug,
          animes_posters: genre.animes,
          
        }))}
        cardType="genre"
        showButton={true}
        buttonText="Переглянути всі жанри"
        buttonUrl="/genres"
      />

      <CardCollection
        title="Теги сайту"
        items={data.tags.map((tag) => ({
          name: tag.name,
          description: tag.description,
          slug: tag.slug,
          animes_posters: tag.animes,
        }))}
        cardType="genre"
        showButton={true}
        buttonText="Переглянути всі жанри"
        buttonUrl="/genres"
      />

      <ReviewSection reviews={data.latest_reviews} />
    </div>
  );
}

