import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveRight } from "lucide-react";
import { FavoriteAnime, FavoritePerson } from "@/types/user";
import FavouritesCard from "@/components/profile/favourites-card";

interface FavouritesTabsProps {
  animes: FavoriteAnime[];
  people: FavoritePerson[];
  isLoading: boolean;
}

export default function FavouritesTabs({ animes, people, isLoading }: FavouritesTabsProps) {
  return (
    <div className="hidden w-full flex-col md:flex">
      <Tabs
        className="flex w-full flex-col gap-12 bg-transparent text-white"
        defaultValue="anime"
      >
        <TabsList className="flex h-12 w-full flex-row justify-between border-none bg-transparent py-0">
          <div className="flex h-full max-w-sm flex-row gap-2.5 rounded-sm border border-white bg-transparent px-4 py-0 text-white">
            <TabsTrigger
              className="hover:text-blue! rounded-sm text-white transition-colors aria-selected:bg-[#78788066]!"
              value="anime"
            >
              Аніме ({animes.length})
            </TabsTrigger>
            <TabsTrigger
              className="hover:text-blue! text-white transition-colors aria-selected:bg-[#78788066]!"
              value="characters"
            >
              Персонажі ({people.length})
            </TabsTrigger>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border-2 border-white bg-transparent hover:bg-white"
          >
            <MoveRight className="h-6 w-6 text-white transition-colors group-hover:text-black" />
          </Button>
        </TabsList>

        {/* Вкладка Аніме */}
        <TabsContent
          value="anime"
          className="w-full border-none bg-transparent!"
        >
          <Card className="border-none bg-transparent! p-0 text-white!">
            <CardContent className="flex w-full flex-row gap-6 border-none bg-transparent! p-0 overflow-x-auto">
              {animes.length === 0 ? (
                <div className="flex w-full items-center justify-center py-8">
                  <p className="text-[#787880] text-center">
                    Немає улюблених аніме
                  </p>
                </div>
              ) : (
                animes.map((anime) => (
                  <FavouritesCard
                    key={anime.id}
                    imageUrl={anime.poster}
                    title={anime.title}
                    year={parseInt(anime.year)}
                    mediaType={anime.kind}
                    isLoading={isLoading}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка Персонажі */}
        <TabsContent
          value="characters"
          className="w-full border-none bg-transparent!"
        >
          <Card className="border-none bg-transparent! p-0 text-white!">
            <CardContent className="flex w-full flex-row gap-6 border-none bg-transparent! p-0 overflow-x-auto">
              {people.length === 0 ? (
                <div className="flex w-full items-center justify-center py-8">
                  <p className="text-[#787880] text-center">
                    Немає улюблених персонажів
                  </p>
                </div>
              ) : (
                people.map((person) => (
                  <FavouritesCard
                    key={person.id}
                    imageUrl={person.poster || '/assets/default-character.png'}
                    title={person.name}
                    // year={person.year ? parseInt(person.year) : undefined}
                    // mediaType={person.type || 'Персонаж'}
                    isLoading={isLoading}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}