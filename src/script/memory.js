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
    const [completedLevel, setCompletedLevel] = useState(null);
    const [gameCompleted, setGameCompleted] = useState(false);

    const TOTAL_CARDS = 12;
    const PAIR_COUNT = TOTAL_CARDS / 2;

    const handleColsChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (val >= 2 && val <= 6) {
            setGridCols(val);
        }
    };

    const fetchWords = async (categoryNumber, theme) => {
        try {
            const res = await fetch(`/api/words?theme=${encodeURIComponent(theme)}&category=${categoryNumber}`);
            const data = await res.json();
            console.log("🎮 Memory fetching words for theme:", theme, "- received:", data.words?.length || 0, "words");
            return data.words || [];
        } catch (err) {
            console.error("Erreur fetch words", err);
            return [];
        }
    };

    const initializeGame = async () => {
        // Read theme from URL parameters
        const params = new URLSearchParams(window.location.search);
        const theme = params.get("theme") || "Foods";
        console.log("🎯 Memory URL params - theme:", theme, ", difficulty:", difficulty);
        
        const words = await fetchWords(difficulty, theme);
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

            // Record word win for progress tracking
            fetch("/api/knownwords/v2", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wordId: first.wordId }),
            }).catch((err) => console.error("record word win error", err));
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
        if (solved.length === cards.length && cards.length > 0 && !won) {
            setWon(true);
            setCompletedLevel(difficulty);

            // award XP when the user wins this memory round
            (async () => {
                try {
                    const params = new URLSearchParams(window.location.search);
                    const theme = params.get("theme") || "Foods";
                    const levelParam = Number(params.get("level") || difficulty || 1);

                    const res = await fetch("/api/xp/award", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ game: "memory", level: levelParam, theme, xp: 50 }),
                    });

                    if (res.ok) {
                        window.dispatchEvent(new Event("xp-updated"));
                    }
                } catch (err) {
                    console.error("Failed to award XP", err);
                }
            })();

            const currentDifficulty = difficulty;
            setTimeout(() => {
                const curIndex = difficulties.indexOf(currentDifficulty);
                if (curIndex < difficulties.length - 1) {
                    const next = difficulties[curIndex + 1];
                    setDifficulty(next);
                    setWon(false);
                    setCompletedLevel(null);
                } else {
                    // All levels completed - show final victory!
                    setGameCompleted(true);
                }
            }, 1500);
        }
    }, [solved, cards]);

    const restartGame = () => {
        setGameCompleted(false);
        setDifficulty(1);
        setWon(false);
    };

    const gridTemplate = `repeat(${gridCols}, minmax(0, 1fr))`;

    // Get theme from URL for display
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const theme = params.get("theme") || "Foods";

    // Show final victory screen when all levels are completed
    if (gameCompleted) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
                style={{backgroundColor: "rgba(224, 211, 239, 1)"}}
            >
                {/* Win Popup Modal - matching hangman style */}
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl animate-bounce-in">
                        <div className="text-6xl mb-4">🎉🏆🎉</div>
                        <h2 className="text-2xl font-bold text-purple-700 mb-2">Félicitations !</h2>
                        <p className="text-gray-600 mb-2">Vous avez gagné le Memory !</p>
                        <p className="text-purple-600 font-semibold mb-4">Thème: {theme}</p>
                        {/* <p className="text-green-600 font-bold mb-6">+50 XP gagnés !</p> */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={restartGame}
                                className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 shadow-lg font-semibold"
                            >
                                Rejouer
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 shadow font-semibold"
                            >
                                Retour aux jeux
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

            {won && completedLevel && (
                <div className="mt-4 text-2xl md:text-3xl font-bold text-green-600 animate-bounce text-center">
                    Bravo ! Niveau {completedLevel} terminé 🎉
                </div>
            )}
        </div>
    );
};

export default Memory;