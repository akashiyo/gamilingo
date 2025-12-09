"use client";

import { useRouter } from "next/navigation";

interface OneCardProps {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  bgColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  navigateToGames?: boolean;
  level?: number;
}

export default function OneCard({
  title,
  description,
  buttonText,
  image,
  bgColor,
  buttonColor,
  buttonHoverColor,
  navigateToGames,
}: OneCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (navigateToGames) {
      router.push(`/flashcards?theme=${encodeURIComponent(title)}`);
    }
  };

  return (
    <div
      className="max-w-xl w-full rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6"
      style={{ backgroundColor: bgColor }}
    >
      <img
        src={image}
        alt={title}
        className="w-32 h-32 rounded-full object-cover shadow-md"
      />

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>

        {navigateToGames && (
          <button
            className="mt-4 relative overflow-hidden text-white text-lg font-medium py-2 px-6 rounded-xl transition-colors duration-300"
            style={{ backgroundColor: buttonColor }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                buttonHoverColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                buttonColor;
            }}
            onClick={handleClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
