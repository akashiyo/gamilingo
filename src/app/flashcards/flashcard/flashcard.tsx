"use client";

import { useState, useEffect } from "react";

interface FlashcardProps {
  theme: string;
  categoryNumber?: number;
  onCountsChange?: (known: number, unknown: number) => void;
}

interface Word {
  id: number;
  en: string;
  fr: string;
  definition: string;
}

interface FlashcardCardProps {
  uniqueId: number;
  textEn: string;
  textFr: string;
  definition: string;
}

export default function Flashcard({ theme, categoryNumber, onCountsChange }: FlashcardProps) {
  const [cards, setCards] = useState<FlashcardCardProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadWords = async () => {
      const fetched = await fetchWords(theme, categoryNumber);
      const cardPairs = fetched.map((word) => ({
        uniqueId: word.id,
        textEn: word.en,
        textFr: word.fr,
        definition: word.definition,
      }));
      setCards(cardPairs);
      setCurrentIndex(0);
    };
    loadWords();
  }, [theme, categoryNumber]);

  useEffect(() => {
    const stored = localStorage.getItem("knownWords");
    if (stored) setKnownWords(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const known = Object.values(knownWords).filter(Boolean).length;
    const unknown = Object.values(knownWords).filter((v) => v === false).length;
    onCountsChange?.(known, unknown);
  }, [knownWords, onCountsChange]);

  const handleFlip = () => setFlipped((f) => !f);
  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handleCardKnown = async () => {
    const currentCard = cards[currentIndex];
    setKnownWords((prev) => {
      const updated = { ...prev, [currentCard.uniqueId]: true };
      localStorage.setItem("knownWords", JSON.stringify(updated));
      return updated;
    });
    await saveKnownStatus(currentCard.uniqueId, true);
    handleNext();
  };

  const handleCardUnknown = async () => {
    const currentCard = cards[currentIndex];
    setKnownWords((prev) => {
      const updated = { ...prev, [currentCard.uniqueId]: false };
      localStorage.setItem("knownWords", JSON.stringify(updated));
      return updated;
    });
    await saveKnownStatus(currentCard.uniqueId, false);
    handleNext();
  };

  const handleIndice = () => {
    const indice = document.getElementById("indice");
    indice?.classList.toggle("hidden");
    indice?.classList.toggle("block");
  };

  if (cards.length === 0)
    return <div className="flex justify-center items-center h-96 w-80 text-gray-500 text-lg">Loading...</div>;

  const card = cards[currentIndex];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-80 h-110 flex items-center justify-center text-xl font-semibold rounded-lg cursor-pointer [perspective:1000px]"
        onClick={handleFlip}
      >
        <div className={`relative w-full font-normal h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
          {/* FRONT */}
          <div className="px-4 absolute flex-col inset-0 flex items-center justify-center bg-[var(--dark-purple)] text-white rounded-[25px] [backface-visibility:hidden]">
            {card.textEn}
            <div id="indice" className="hidden">{card.definition}</div>
          </div>

          {/* BACK */}
          <div className="p-0 absolute inset-0 flex text-start flex-col items-start bg-[var(--lightest-purple)] text-gray-900 rounded-[25px] [transform:rotateY(180deg)] [backface-visibility:hidden] text-base">
            <div className="img-container w-full p-2 h-70 rounded-[16px] bg-[var(--dark-purple)] flex items-center justify-center">
            {/* <div className="img-container w-full p-2 h-70 rounded-[16px] bg-[var(--dark-purple)]"> */}
              {/* <div className="rounded-full w-full h-20">
                <img className="w-full h-auto rounded-2xl" src="https://images.pexels.com/photos/2527491/pexels-photo-2527491.jpeg" />
                <h2 className="text-center text-3xl mt-4 text-white">{card.textEn}</h2>
              </div> */}
              <h2 className="text-center text-3xl mt-4 text-white">{card.textEn}</h2>
            </div>
            <div className="mt-6 mx-4">
              <div>{card.textEn} : {card.textFr}</div>
              <div>{card.definition}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3">
        <button className="mt-4 px-4 py-2 bg-transparent text-white rounded border-2 border-[var(--dark-grey)] p-4" onClick={handleCardUnknown}>
          <img src="/iconCross.svg" />
        </button>
        <button className="bg-[var(--vibrant-yellow)] mt-4 px-4 py-2 rounded" onClick={handleIndice}>
          <img src="/iconLoop_indice.svg" />
        </button>
        <button className="mt-4 px-4 py-2 text-white rounded border-2 border-[var(--dark-grey)]" onClick={handleCardKnown}>
          <img src="/iconCheck.svg" />
        </button>
      </div>
    </div>
  );
}

// --- Helper functions ---
const saveKnownStatus = async (wordId: number, known: boolean) => {
  try {
    await fetch("/api/knownwords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId, known }),
    });
  } catch (err) {
    console.error("Error saving known status", err);
  }
};

const fetchWords = async (theme: string, categoryNumber?: number): Promise<Word[]> => {
  try {
    let url = `/api/words?theme=${theme}`;
    if (categoryNumber !== undefined) url += `&category=${categoryNumber}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    const data = await res.json();
    return data.words || [];
  } catch (err) {
    console.error("Erreur fetch words", err);
    return [];
  }
};
