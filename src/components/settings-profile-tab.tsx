import React, { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SettingsSelect2 from "@/components/ui/settings-select-2";
import CalendarIcon from "@/assets/calendar.svg";
import { Calendar } from "@/components/ui/calendar";
import BlueButton from "@/components/ui/blue-button";

interface SettingsProfileTabProps {
  username: string;
  setUsername: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  nickname: string;
  setNickname: (v: string) => void;
  about: string;
  setAbout: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  birthdate: string;
  setBirthdate: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  cover: string;
  setCover: (v: string) => void;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverUpload?: (file: File) => void;
  pendingAvatarFile: File | null;
  pendingCoverFile: File | null;
  userSettings?: any;
}

const genderOptions = [
  { value: "female", label: "Жіноча" },
  { value: "male", label: "Чоловіча" },
  { value: "other", label: "Інше" },
];

const SettingsProfileTab: React.FC<SettingsProfileTabProps> = ({
  username,
  setUsername,
  avatar,
  setAvatar,
  nickname,
  setNickname,
  about,
  setAbout,
  location,
  setLocation,
  birthdate,
  setBirthdate,
  gender,
  setGender,
  cover,
  setCover,
  handleAvatarUpload,
  handleCoverUpload,
  pendingAvatarFile,
  pendingCoverFile,
  userSettings,
}) => {
  const [coverUploading, setCoverUploading] = useState(false);

  // Обробка вибору файлу аватарки
  const handleAvatarUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Перевіряємо розмір файлу (2 МБ максимум)
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл занадто великий. Максимальний розмір — 2 МБ");
        return;
      }
      
      // Перевіряємо тип файлу
      if (!file.type.startsWith('image/')) {
        alert("Будь ласка, виберіть файл зображення");
        return;
      }
      
      // Передаємо в загальний обробник
      handleAvatarUpload(e);
    }
  };

  const handleCoverUploadLocal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Перевіряємо розмір файлу (2 МБ максимум)
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл занадто великий. Максимальний розмір — 2 МБ");
        return;
      }
      
      // Перевіряємо тип файлу
      if (!file.type.startsWith('image/')) {
        alert("Будь ласка, виберіть файл зображення");
        return;
      }
      
      // Показуємо превью локально
      const url = URL.createObjectURL(file);
      setCover(url);

      // Завантажуємо через загальний обробник
      if (handleCoverUpload) {
        try {
          setCoverUploading(true);
          await handleCoverUpload(file);
        } catch (error) {
          console.error("Error uploading cover:", error);
          // При помилці повертаємо попередню обкладинку
          setCover(userSettings?.backdrop || "");
        } finally {
          setCoverUploading(false);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-0 pt-8">
      <h2 className="text-2xl font-bold text-white mb-1">Профіль</h2>
      <p className="text-[#bfc6d5] mb-6 text-base">
        Налаштуйте вигляд та деталі свого профілю
      </p>
      <div className="mb-2">
        <div className="text-white text-base font-semibold mb-1">
          Зображення профілю
        </div>
        <div className="text-[#bfc6d5] text-sm mb-4">
          Рекомендований розмір обкладинки 1500 x 500, аватару 400 x 400
          <br />
          Максимальний розмір — 2 МБ, формат jpg, png, webp, aviff
        </div>
        <div className="relative w-full h-28 mb-8">
          <label
            htmlFor="cover-upload"
            className={`w-full h-full bg-[#23252a] rounded-xl flex items-center justify-center text-[#bfc6d5] text-base font-medium cursor-pointer border border-[#23252a] overflow-hidden relative ${
              coverUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {cover ? (
              <Image
                src={cover}
                alt="cover"
                fill
                className="object-cover w-full h-full absolute top-0 left-0 z-0 rounded-xl"
              />
            ) : null}
            <span className="relative z-10 bg-black bg-opacity-50 px-3 py-1 rounded">
              {coverUploading 
                ? "Завантаження..." 
                : pendingCoverFile 
                  ? "Готово до збереження" 
                  : "Натисніть, щоб завантажити обкладинку"
              }
            </span>
            <input
              id="cover-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleCoverUploadLocal}
              disabled={coverUploading}
            />
          </label>
          
          <div className="absolute left-8 -bottom-5 z-20">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1a1a1a] border-4 border-[#23252a] shadow-lg">
                <Image
                  src={avatar}
                  alt="User avatar"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
                {/* Індикатор pending файлу аватарки */}
                {pendingAvatarFile && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-[#4b7fcc] w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#23252a]">
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer w-full h-full flex items-center justify-center"
                  title={pendingAvatarFile ? "Аватарка готова до збереження" : "Змінити аватарку"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={handleAvatarUploadLocal}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <form className="w-full flex flex-col gap-4 mt-12">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-white text-base font-medium"
          >
            Нове ім'я користувача
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-transparent border border-[#49638A] rounded-lg px-4 py-2 text-white text-base focus:border-blue-400 focus:ring-0 placeholder:text-[#bfc6d5]"
            placeholder="Введіть нове ім'я"
          />
          <BlueButton text="Зберегти" className="mt-2 w-32" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="about" className="text-white text-base font-medium">
            Опис
          </label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={3}
            className="bg-transparent h-28 border border-[#49638A] rounded-lg px-4 py-2 text-white text-base focus:border-blue-400 focus:outline-none focus:ring-0 placeholder:text-[#bfc6d5] resize-none"
            placeholder="Введіть опис"
            maxLength={500}
          />
          <div className="text-[#bfc6d5] text-xs text-right">
            {about.length}/500 символів
          </div>
          <BlueButton text="Зберегти" className="mt-2 w-32" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="birthdate" className="text-white text-base font-medium">
            Дата народження
          </label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="bg-transparent border border-[#49638A] rounded-lg px-4 py-2 text-white text-base focus:border-blue-400 focus:ring-0"
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="gender" className="text-white text-base font-medium">
            Стать
          </label>
          <SettingsSelect2
            value={gender}
            onChange={setGender}
            options={genderOptions}
            placeholder="Виберіть стать"
          />
        </div>
      </form>
      
      {/* Інформація про pending файли */}
      {(pendingAvatarFile || pendingCoverFile) && (
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm font-medium mb-2">Файли готові до збереження:</p>
          <ul className="text-blue-200 text-xs space-y-1">
            {pendingAvatarFile && (
              <li>• Аватарка: {pendingAvatarFile.name} ({(pendingAvatarFile.size / 1024).toFixed(1)} КБ)</li>
            )}
            {pendingCoverFile && (
              <li>• Обкладинка: {pendingCoverFile.name} ({(pendingCoverFile.size / 1024).toFixed(1)} КБ)</li>
            )}
          </ul>
          <p className="text-blue-300/70 text-xs mt-2">
            Натисніть "Зберегти зміни" внизу сторінки для завантаження файлів
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsProfileTab;