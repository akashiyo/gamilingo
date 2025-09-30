"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Word } from "@/types/word";

export default function WordManager() {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState({
    en: "",
    fr: "",
    category: 1,
    definition: "",
    img: "",
    theme: "",
  });

  useEffect(() => {
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => setWords(data.words));
  }, []);

  // === Supprimer un mot ===
  const deleteWord = async (id: number) => {
    const res = await fetch(`/api/words/${id}`, { method: "DELETE" });
    if (res.ok) {
      setWords((prev) => prev.filter((w) => w.id !== id));
    } else {
      alert("Failed to delete word");
    }
  };

  // === Convertir l'image en base64 ===
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewWord((prev) => ({
        ...prev,
        img: reader.result?.toString().split(",")[1] || "",
      }));
    };
    reader.readAsDataURL(file);
  };

  // === Ajouter un mot ===
  const addWord = async () => {
    if (!newWord.en || !newWord.fr || !newWord.definition) {
      alert("Please fill all required fields");
      return;
    }

    const res = await fetch("/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWord),
    });
    const data = await res.json();

    if (res.ok) {
      setWords((prev) => [...prev, data.word]);
      setNewWord({ en: "", fr: "", category: 1, definition: "", img: "", theme: "" });
    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Word Manager</h2>

      {/* formulaire */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="English word"
          value={newWord.en}
          onChange={(e) => setNewWord({ ...newWord, en: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <input
          type="text"
          placeholder="French word"
          value={newWord.fr}
          onChange={(e) => setNewWord({ ...newWord, fr: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <select
          value={newWord.category}
          onChange={(e) =>
            setNewWord({ ...newWord, category: Number(e.target.value) })
          }
          className="border p-2 w-full"
          required
        >
          <option value={1}>Easy</option>
          <option value={2}>Medium</option>
          <option value={3}>Hard</option>
        </select>

        <textarea
          placeholder="Definition"
          value={newWord.definition}
          onChange={(e) =>
            setNewWord({ ...newWord, definition: e.target.value })
          }
          className="border p-2 w-full"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <input
          type="text"
          placeholder="Theme"
          value={newWord.theme}
          onChange={(e) => setNewWord({ ...newWord, theme: e.target.value })}
          className="border p-2 w-full"
          required
        />

        <button
          onClick={addWord}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Word
        </button>
      </div>

      {/* liste des mots */}
      <ul className="space-y-2">
        {words.map((w) => (
          <li
            key={w.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <span>
              <strong>{w.en}</strong> → {w.fr} ({w.category})  
              <br />
              <em>{w.definition}</em>
            </span>
            <div className="flex items-center gap-2">
              {w.img && (
                <img
                  src={`data:image/png;base64,${w.img}`}
                  alt="word"
                  className="w-12 h-12 object-cover"
                />
              )}
              <button
                onClick={() => deleteWord(w.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
