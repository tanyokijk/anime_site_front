import React, { useRef, useState } from "react";
import SettingsSelect from "@/components/ui/settings-select";
import ToggleSwitch from "@/components/toggle-switch";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SettingsSelect2 from "@/components/ui/settings-select-2";
import CalendarIcon from "@/assets/calendar.svg";
import { Calendar } from "@/components/ui/calendar";
import BlueButton from "@/components/ui/blue-button";

interface SettingsPreferencesTabProps {
  gender: string;
  setGender: (v: string) => void;
  birthdate: string;
  setBirthdate: (v: string) => void;

  allow_adult: boolean;
  setAllowAdult: (v: boolean) => void;

  is_auto_next: boolean;
  setIsAutoNext: (v: boolean) => void;

  is_auto_play: boolean;
  setIsAutoPlay: (v: boolean) => void;

  is_auto_skip_intro: boolean;
  setIsAutoSkipIntro: (v: boolean) => void;

  is_private_favorites: boolean;
  setIsPrivateFavorites: (v: boolean) => void;
}
const genderOptions = [
  { value: "female", label: "Жіноча" },
  { value: "male", label: "Чоловіча" },
  { value: "other", label: "Інше" },
];
  

const SettingsPreferencesTab: React.FC<SettingsPreferencesTabProps> = ({
  gender,
  setGender,
  birthdate,
  setBirthdate,
  allow_adult,
  setAllowAdult,
  is_auto_next,
  setIsAutoNext,
  is_auto_play,
  setIsAutoPlay,
  is_auto_skip_intro,
  setIsAutoSkipIntro,
  is_private_favorites,
  setIsPrivateFavorites,
}) => {
  const [birthdateError, setBirthdateError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
const validateBirthdate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    if (date > now) return "Дата не може бути в майбутньому";
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 10);
    if (date > minDate) return "Вам має бути не менше 10 років";
    return "";
  };
    const handleBirthdateSelect = (date: Date | undefined) => {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    setBirthdate(iso);
    setBirthdateError(validateBirthdate(iso));
    setCalendarOpen(false);
  };
  return (
  <div className="flex flex-col gap-6">
    {/* Перша секція: стать і дата народження */}
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-2">
        <label htmlFor="gender" className="text-white text-base font-medium">
          Стать
        </label>
        <div className="relative text-white">
          <SettingsSelect2
            label=""
            value={gender}
            onChange={setGender}
            options={genderOptions}
            placeholder="Оберіть стать"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <label htmlFor="birthdate" className="text-white text-base font-medium">
          Дата народження
        </label>
        <div className="relative">
          <Input
            id="birthdate"
            type="text"
            value={birthdate ? new Date(birthdate).toLocaleDateString() : ""}
            readOnly
            className={`bg-transparent border border-[#49638A] rounded-lg px-4 py-2 text-white text-base focus:border-blue-400 focus:ring-0 placeholder:text-[#bfc6d5] pr-12 ${
              birthdateError ? "border-red-500" : ""
            }`}
            placeholder="ДД. ММ. РРРР"
            aria-invalid={!!birthdateError}
            onClick={() => setCalendarOpen(true)}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bfc6d5]"
            onClick={() => setCalendarOpen((v) => !v)}
            aria-label="Вибрати дату"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 7V3M16 7V3M3 11H21M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                stroke="#bfc6d5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {calendarOpen && (
            <div className="absolute z-30 right-0 top-full mt-2">
              <Calendar
                mode="single"
                selected={birthdate ? new Date(birthdate) : undefined}
                onSelect={handleBirthdateSelect}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                onDayClick={() => setCalendarOpen(false)}
                captionLayout="dropdown"
                className="rounded-lg border border-[#49638A] shadow-sm text-white bg-black"
              />
            </div>
          )}
          {birthdateError && (
            <span className="absolute left-0 -bottom-6 text-red-500 text-xs">
              {birthdateError}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Друга секція: перемикачі */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ToggleSwitch
        label="Дозволити дорослий контент (18+)"
        checked={allow_adult}
        onChange={setAllowAdult}
      />
      <ToggleSwitch
        label="Автоматично перемикати на наступну серію"
        checked={is_auto_next}
        onChange={setIsAutoNext}
      />
      <ToggleSwitch
        label="Автоматичне відтворення відео"
        checked={is_auto_play}
        onChange={setIsAutoPlay}
      />
      <ToggleSwitch
        label="Пропускати вступ (інтро)"
        checked={is_auto_skip_intro}
        onChange={setIsAutoSkipIntro}
      />
      <ToggleSwitch
        label="Приховати список улюблених аніме"
        checked={is_private_favorites}
        onChange={setIsPrivateFavorites}
      />
    </div>
  </div>
);
};

export default SettingsPreferencesTab;
