"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FlashcardsPage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  const theme = searchParams.get("theme");
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      // Try server-side filtering via query params. If not supported by API,
      // fall back to client-side filtering so the page still works.
      const qry = new URLSearchParams();
      if (level) qry.set("category", String(level));
      if (theme) qry.set("theme", String(theme));

      const res = await fetch(`/api/words?${qry.toString()}`);
      const data = await res.json();

      if (Array.isArray(data.words)) {
        // If API did not filter, filter here as a fallback
        const filtered = data.words.filter((w: any) => {
          const matchLevel = level ? Number(w.category) === Number(level) : true;
          const matchTheme = theme ? String(w.theme) === String(theme) : true;
          return matchLevel && matchTheme;
        });
        setWords(filtered);
      } else {
        setWords([]);
      }
    };
    fetchWords();
  }, [level, theme]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Flashcards – {theme} (Level {level})
      </h2>
      <div className="space-y-2">
        {words.map((word) => {
          const fallback = "/images/flashcard.png";
          const mime = word.imgMime || "image/png";
          const imgSrc = word.img ? `data:${mime};base64,${word.img}` : fallback;

          return (
            <div key={word.id} className="bg-gray-100 p-3 rounded-lg flex items-center gap-4">
              <img
                src={imgSrc}
                alt={word.en}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== fallback) target.src = fallback;
                }}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="font-bold">{word.en}</p>
                <p className="text-gray-600">{word.fr}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
