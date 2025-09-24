import React from "react";
import { slashMenuOptions } from "@/utils/slashMenuOptions";

interface SlashMenuProps {
  position: { top: number; left: number };
  onSelect: (option: (typeof slashMenuOptions)[0]) => void;
}

export const SlashMenu: React.FC<SlashMenuProps> = ({ position, onSelect }) => {
  return (
    <div
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg py-2 min-w-48"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {slashMenuOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
        >
          <span className="font-mono text-gray-600 min-w-8">{option.icon}</span>
          <span className="text-gray-700">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
