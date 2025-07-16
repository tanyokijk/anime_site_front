import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

interface ProfileBannerProps {
  user: User | null;
  isLoading: boolean;
}

export default function ProfileBanner({ user, isLoading }: ProfileBannerProps) {
  const userProfileBannerUrl = user?.backdrop || "/assets/user-profile-banner.png";

  if (isLoading) {
    return (
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-[25vh] w-full sm:h-[55vh] xl:h-[45vh]">
        <Skeleton className="h-full w-full bg-stone-500" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute top-0 left-0 z-0 h-[25vh] w-full sm:h-[55vh] xl:h-[45vh]">
      <Image
        src={userProfileBannerUrl}
        alt="User Profile Banner"
        fill
        className="h-full w-full object-cover opacity-30"
        priority
        unoptimized
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/assets/user-profile-banner.png";
        }}
      />
      
      {/* Градієнтний оверлей */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    </div>
  );
}