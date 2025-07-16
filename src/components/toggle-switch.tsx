import React from "react";
import clsx from "clsx";

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  className = "",
  label,
}) => {
  return (
    <label className={clsx("flex items-center gap-4 cursor-pointer", className)}>
      {label && <span className="text-white text-sm sm:text-base">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={clsx(
            "w-12 h-6 rounded-full transition-colors duration-200",
            checked ? "bg-blue-500" : "bg-gray-600"
          )}
        ></div>
        <div
          className={clsx(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-0"
          )}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
