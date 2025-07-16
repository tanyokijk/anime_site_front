import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ReviewCardProps {
  user_name: string;
  review_date: string;
  anime_name: string;
  number: number;
  review: string;
  isLoading?: boolean;
}

const Star = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.15268 6.88484L1.77268 7.80984L1.65968 7.83284C1.48862 7.87826 1.33267 7.96825 1.20777 8.09365C1.08287 8.21904 0.993482 8.37533 0.94874 8.54657C0.903999 8.71781 0.905505 8.89785 0.953106 9.06832C1.00071 9.23878 1.09269 9.39356 1.21968 9.51684L5.84168 14.0158L4.75168 20.3708L4.73868 20.4808C4.72821 20.6578 4.76494 20.8343 4.84513 20.9923C4.92531 21.1504 5.04606 21.2843 5.19501 21.3804C5.34397 21.4764 5.51577 21.5311 5.69283 21.539C5.86989 21.5468 6.04584 21.5074 6.20268 21.4248L11.9087 18.4248L17.6017 21.4248L17.7017 21.4708C17.8667 21.5359 18.0461 21.5558 18.2214 21.5286C18.3967 21.5014 18.5617 21.4281 18.6993 21.3161C18.8369 21.2041 18.9422 21.0576 19.0045 20.8915C19.0668 20.7254 19.0838 20.5457 19.0537 20.3708L17.9627 14.0158L22.5867 9.51584L22.6647 9.43084C22.7761 9.29361 22.8492 9.1293 22.8764 8.95464C22.9036 8.77998 22.8841 8.60122 22.8198 8.43657C22.7554 8.27193 22.6486 8.12728 22.5102 8.01736C22.3717 7.90744 22.2066 7.83618 22.0317 7.81084L15.6517 6.88484L12.7997 1.10484C12.7172 0.937379 12.5894 0.796359 12.4309 0.697749C12.2723 0.599138 12.0894 0.546875 11.9027 0.546875C11.716 0.546875 11.533 0.599138 11.3745 0.697749C11.216 0.796359 11.0882 0.937379 11.0057 1.10484L8.15268 6.88484Z"
      fill="#DFD50A"
    />
  </svg>
);

const EmptyStar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.15268 6.88484L1.77268 7.80984L1.65968 7.83284C1.48862 7.87826 1.33267 7.96825 1.20777 8.09365C1.08287 8.21904 0.993482 8.37533 0.94874 8.54657C0.903999 8.71781 0.905505 8.89785 0.953106 9.06832C1.00071 9.23878 1.09269 9.39356 1.21968 9.51684L5.84168 14.0158L4.75168 20.3708L4.73868 20.4808C4.72821 20.6578 4.76494 20.8343 4.84513 20.9923C4.92531 21.1504 5.04606 21.2843 5.19501 21.3804C5.34397 21.4764 5.51577 21.5311 5.69283 21.539C5.86989 21.5468 6.04584 21.5074 6.20268 21.4248L11.9087 18.4248L17.6017 21.4248L17.7017 21.4708C17.8667 21.5359 18.0461 21.5558 18.2214 21.5286C18.3967 21.5014 18.5617 21.4281 18.6993 21.3161C18.8369 21.2041 18.9422 21.0576 19.0045 20.8915C19.0668 20.7254 19.0838 20.5457 19.0537 20.3708L17.9627 14.0158L22.5867 9.51584L22.6647 9.43084C22.7761 9.29361 22.8492 9.1293 22.8764 8.95464C22.9036 8.77998 22.8841 8.60122 22.8198 8.43657C22.7554 8.27193 22.6486 8.12728 22.5102 8.01736C22.3717 7.90744 22.2066 7.83618 22.0317 7.81084L15.6517 6.88484L12.7997 1.10484C12.7172 0.937379 12.5894 0.796359 12.4309 0.697749C12.2723 0.599138 12.0894 0.546875 11.9027 0.546875C11.716 0.546875 11.533 0.599138 11.3745 0.697749C11.216 0.796359 11.0882 0.937379 11.0057 1.10484L8.15268 6.88484Z"
      fill="#232323"
      stroke="#444"
      strokeWidth="1.5"
    />
  </svg>
);

const HalfStar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="half-gradient">
        <stop offset="50%" stopColor="#DFD50A" />
        <stop offset="50%" stopColor="#232323" />
      </linearGradient>
    </defs>
    <path
      d="M8.15268 6.88484L1.77268 7.80984L1.65968 7.83284C1.48862 7.87826 1.33267 7.96825 1.20777 8.09365C1.08287 8.21904 0.993482 8.37533 0.94874 8.54657C0.903999 8.71781 0.905505 8.89785 0.953106 9.06832C1.00071 9.23878 1.09269 9.39356 1.21968 9.51684L5.84168 14.0158L4.75168 20.3708L4.73868 20.4808C4.72821 20.6578 4.76494 20.8343 4.84513 20.9923C4.92531 21.1504 5.04606 21.2843 5.19501 21.3804C5.34397 21.4764 5.51577 21.5311 5.69283 21.539C5.86989 21.5468 6.04584 21.5074 6.20268 21.4248L11.9087 18.4248L17.6017 21.4248L17.7017 21.4708C17.8667 21.5359 18.0461 21.5558 18.2214 21.5286C18.3967 21.5014 18.5617 21.4281 18.6993 21.3161C18.8369 21.2041 18.9422 21.0576 19.0045 20.8915C19.0668 20.7254 19.0838 20.5457 19.0537 20.3708L17.9627 14.0158L22.5867 9.51584L22.6647 9.43084C22.7761 9.29361 22.8492 9.1293 22.8764 8.95464C22.9036 8.77998 22.8841 8.60122 22.8198 8.43657C22.7554 8.27193 22.6486 8.12728 22.5102 8.01736C22.3717 7.90744 22.2066 7.83618 22.0317 7.81084L15.6517 6.88484L12.7997 1.10484C12.7172 0.937379 12.5894 0.796359 12.4309 0.697749C12.2723 0.599138 12.0894 0.546875 11.9027 0.546875C11.716 0.546875 11.533 0.599138 11.3745 0.697749C11.216 0.796359 11.0882 0.937379 11.0057 1.10484L8.15268 6.88484Z"
      fill="url(#half-gradient)"
      stroke="#444"
      strokeWidth="1.5"
    />
  </svg>
);

const ReviewCard: React.FC<ReviewCardProps> = ({
  user_name,
  review_date,
  anime_name,
  number,
  review,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#181818] rounded-2xl p-6 text-white w-full shadow-lg border border-[#232323]">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Skeleton circle height={12} width={12} className="mr-2" />
            <Skeleton height={16} width={120} />
          </div>
          <Skeleton height={16} width={80} />
        </div>
        <div className="flex gap-1 my-2">
          <Skeleton height={18} width={90} />
        </div>
        <Skeleton height={20} width={220} className="mb-2" />
        <Skeleton height={20} width={180} />
        <div className="mt-4">
          <Skeleton height={16} width={120} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] rounded-2xl p-6 text-white w-full shadow-lg border border-[#232323]">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#1CB5E0] mr-2"></span>
          <span className="font-medium text-sm">
            {user_name.toUpperCase()},{" "}
            <span className="text-[#CFCFCF] text-sm">{review_date}</span>
          </span>
        </div>
        <span className="text-[#fff] text-sm font-normal text-right max-w-[220px]">
          {anime_name}
        </span>
      </div>
      
      <div className="flex gap-1 my-2" aria-label={`Оцінка: ${number} з 5`}>
        {(() => {
          const fullStars = Math.floor(number);
          const hasHalf = number % 1 >= 0.5;
          const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
          return [
            ...Array(fullStars).fill("full"),
            ...(hasHalf ? ["half"] : []),
            ...Array(emptyStars).fill("empty"),
          ].map((type, i) => (
            <span
              key={i}
              className="inline-block align-middle opacity-100"
              aria-hidden="true"
            >
              {type === "full" && <Star />}
              {type === "half" && <HalfStar />}
              {type === "empty" && <EmptyStar />}
            </span>
          ));
        })()}
      </div>

      {/* Додано блок для відображення тексту відгуку */}
      {review && review.trim() && (
        <div className="mt-4 text-[#E0E0E0] text-sm leading-relaxed">
          {review}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;