"use client";
import { useEffect, useState } from "react";

const difficulties = [1, 2, 3];

const Memory = () => {
    const [gridCols, setGridCols] = useState(4);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);
    const [difficulty, setDifficulty] = useState(1);

    const TOTAL_CARDS = 12;
    const PAIR_COUNT = TOTAL_CARDS / 2;

    const handleColsChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (val >= 2 && val <= 6) {
            setGridCols(val);
        }
    };

    const fetchWords = async (categoryNumber) => {
        try {
            const res = await fetch(`/api/words?theme=Foods&category=${categoryNumber}`);
            const data = await res.json();
            return data.words || [];
        } catch (err) {
            console.error("Erreur fetch words", err);
            return [];
        }
    };

    const initializeGame = async () => {
        const words = await fetchWords(difficulty);
        if (!words || words.length === 0) {
            setCards([]);
            return;
        }

        const selectedWords = words.slice(0, PAIR_COUNT);

        const cardPairs = selectedWords.flatMap((word) => [
            { uniqueId: `${word.id}-en`, wordId: word.id, text: word.en, lang: "en" },
            { uniqueId: `${word.id}-fr`, wordId: word.id, text: word.fr, lang: "fr" },
        ]);

        const cardsToUse = cardPairs.slice(0, TOTAL_CARDS);
        const shuffled = cardsToUse.sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setWon(false);
    };

    useEffect(() => {
        initializeGame();
    }, [difficulty]);

    const checkMatch = (secondIdx) => {
        const [firstIdx] = flipped;
        const first = cards[firstIdx];
        const second = cards[secondIdx];

        if (first.wordId === second.wordId && first.uniqueId !== second.uniqueId) {
            setSolved((s) => [...s, firstIdx, secondIdx]);
            setFlipped([]);
            setDisabled(false);
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000);
        }
    };

    const handleClick = (idx) => {
        if (disabled || won || flipped.includes(idx)) return;

        if (flipped.length === 0) {
            setFlipped([idx]);
        } else if (flipped.length === 1) {
            setDisabled(true);
            setFlipped((f) => [...f, idx]);
            checkMatch(idx);
        }
    };

    const isFlipped = (idx) => flipped.includes(idx) || solved.includes(idx);
    const isSolved = (idx) => solved.includes(idx);

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);

            setTimeout(() => {
                const curIndex = difficulties.indexOf(difficulty);
                if (curIndex < difficulties.length - 1) {
                    const next = difficulties[curIndex + 1];
                    setDifficulty(next);
                } else {
                    initializeGame();
                }
            }, 1500);
        }
    }, [solved, cards, difficulty]);

    const gridTemplate = `repeat(${gridCols}, minmax(0, 1fr))`;

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
            style={{backgroundColor: "rgba(224, 211, 239, 1)"}}
        >
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
            style={{color:"rgba(122, 74, 156, 1)" }}>
                Memory Anglais – Français
            </h1>

            <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-3 md:gap-4 text-sm md:text-base">
                <div className="flex items-center justify-center">
                    <label htmlFor="gridCols" className="mr-2 font-medium">Colonnes</label>
                    <input
                        type="number"
                        id="gridCols"
                        min="2"
                        max="6"
                        value={gridCols}
                        onChange={handleColsChange}
                        className="border-2 border-purple-300 rounded px-3 py-1 w-16"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <label className="font-medium">Niveau actuel :</label>
                    <span className="ml-2 font-bold text-purple-700">{difficulty}</span>
                </div>
            </div>

            <div
                className="grid gap-3 md:gap-4 mb-4 w-full max-w-sm md:max-w-2xl px-2"
                style={{
                    gridTemplateColumns: gridTemplate,
                }}
            >
                {cards.map((card, idx) => (
                    <div
                        key={card.uniqueId}
                        onClick={() => handleClick(idx)}
                        className={`aspect-square flex items-center justify-center text-center p-3 text-sm md:text-lg font-bold rounded-2xl cursor-pointer transition-all duration-300 shadow-lg ${
                            isFlipped(idx)
                                ? isSolved(idx)
                                    ? "bg-white text-green-600 border-4 border-green-300"
                                    : "bg-purple-600 text-white scale-105"
                                : "bg-purple-500 text-purple-500 hover:bg-purple-400"
                        }`}
                        style={{
                            minHeight: '80px',
                        }}
                    >
                        {isFlipped(idx) ? (
                            <span className="break-words px-1">{card.text}</span>
                        ) : (
                            <span className="text-4xl">?</span>
                        )}
                    </div>
                ))}
            </div>

            {won && (
                <div className="mt-4 text-2xl md:text-3xl font-bold text-green-600 animate-bounce text-center">
                    Bravo ! Niveau {difficulty} terminé 🎉
                </div>
            )}
        </div>
    );
};

export default Memory;