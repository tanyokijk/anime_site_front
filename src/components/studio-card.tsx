import React from "react";
import Image from "next/image";
import Link from "next/link";

interface StudioCardProps {
  logo: string;
  name: string;
  description: string;
  releases: number;
  slug: string;
}

export default function StudioCard({
  logo,
  name,
  description,
  releases,
  slug,
}: StudioCardProps) {
  return (
    <Link
      href={`/studios/${slug}`}
      className="group block focus:outline-none"
      tabIndex={0}
      style={{ textDecoration: "none" }}
    >
      <div className="relative box-border flex h-[320px] min-h-[320px] max-w-[650px] min-w-[400px] text-white transition-shadow duration-200 group-hover:shadow-2xl group-focus:shadow-2xl md:h-[260px] md:max-w-full md:min-w-0">
        {/* Логотип */}
        <div className="flex h-full w-[110px] flex-shrink-0 items-center justify-center overflow-hidden rounded-l-2xl rounded-r-none bg-white md:h-full md:w-[150px] md:max-w-[150px] md:min-w-[150px] lg:h-full lg:w-[200px] lg:max-w-[200px] lg:min-w-[200px] xl:h-full xl:w-[150px] xl:max-w-[150px] xl:min-w-[120px]">
          <Image
            src={logo}
            alt={name + " Logo"}
            width={160}
            height={160}
            className="max-h-[160px] max-w-[160px] object-contain md:max-h-[60px] md:max-w-[60px] lg:max-h-[80px] lg:max-w-[80px] xl:max-h-[110px] xl:max-w-[110px]"
          />
        </div>
        {/* Контент */}
        <div className="relative mt-2 ml-2 flex h-full w-full flex-col justify-start md:ml-2 lg:ml-4 xl:ml-6">
          <h2
            className="mb-4 truncate text-3xl leading-tight font-bold group-hover:underline group-focus:underline md:mb-1 md:text-lg lg:mb-2 lg:text-xl xl:mb-3 xl:text-2xl"
            title={name}
          >
            {name}
          </h2>
          <div className="lg:flex lg:flex-1 lg:items-center">
            <p className="line-clamp-5 w-full overflow-hidden pr-2 text-left text-base leading-relaxed font-normal md:pr-0 md:text-xs lg:pr-0 lg:text-xs xl:pr-1 xl:text-sm">
              {description}
            </p>
          </div>
          {/* Кількість релізів */}
          <div
            className="absolute right-4 bottom-2 truncate text-lg font-medium text-[#A0A0A0] select-none md:right-2 md:bottom-1 md:text-xs lg:text-sm xl:text-base"
            style={{ letterSpacing: 0.5 }}
            title={releases + " релізів"}
          >
            {releases} релізів
          </div>
        </div>
      </div>
    </Link>
  );
}
