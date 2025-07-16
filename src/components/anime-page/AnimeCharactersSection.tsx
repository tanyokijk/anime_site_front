import React from "react";
import CardCollection from "@/components/main-page/card-collection";
import AuthorCardComponent from "../author-card";

interface Person {
  slug: string;
  name: string;
  image?: string;
  birthday?: string | null;
  age?: number | null;
  type: string; // "character" або інші
}
interface AnimeCharactersSectionProps {
  authors?: Person[];
  title: string;
  text: string;
}

const AnimeCharactersSection: React.FC<AnimeCharactersSectionProps> = ({
  authors,
  title,
  text,
}) => {
  if (!authors || authors.length === 0) {
    return (
      <section className="mx-auto w-full max-w-2xl">
        <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
        <div className="text-[#888]">{text}</div>
      </section>
    );
  }
  const enrichedAuthors = authors.map((author) => ({
    ...author,
    link:
      title === "Головні персонажі" || title === "Другорядні персонажі"
        ? `/characters/${author.slug}`
        : `/authors/${author.slug}`,
  }));
  return (
    <section className="w-full max-w-4xl">
      <CardCollection
        items={enrichedAuthors}
        cardType="author"
        title={title}
        showButton={false}
      />
    </section>
  );
};

export default AnimeCharactersSection;
