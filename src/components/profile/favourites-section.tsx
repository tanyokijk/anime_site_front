import FavouritesTabs from "@/components/profile/favourites-tabs";
import { User } from "@/types/user";

interface FavouritesSectionProps {
  user: User | null;
  isLoading: boolean;
}

export default function FavouritesSection({ user, isLoading }: FavouritesSectionProps) {
  const favoriteAnimes = user?.favorite_animes || [];
  const favoritePeople = user?.favorite_people || [];

  return (
    <div className="hidden flex-col justify-start xl:flex xl:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[2rem] font-bold text-white">Улюблені</h1>
      </div>
      <FavouritesTabs 
        animes={favoriteAnimes}
        people={favoritePeople}
        isLoading={isLoading} 
      />
    </div>
  );
}