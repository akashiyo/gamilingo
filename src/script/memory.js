"use client";
import { useEffect, useState } from "react";

const difficulties = [1, 2, 3];


const Memory = () => {
    // On peut garder gridSize si tu veux ajuster le nombre de colonnes par exemple
    const [gridCols, setGridCols] = useState(4);  // nombre de colonnes visuelles
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);

    const [difficulty, setDifficulty] = useState(1); // 1 = easy, 2 = medium, 3 = hard

    const TOTAL_CARDS = 12;  // fixe à 12 cartes
    const PAIR_COUNT = TOTAL_CARDS / 2; // = 6 paires

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

        // On prend au plus PAIR_COUNT mots
        const selectedWords = words.slice(0, PAIR_COUNT);

        const cardPairs = selectedWords.flatMap((word) => [
            { uniqueId: `${word.id}-en`, wordId: word.id, text: word.en, lang: "en" },
            { uniqueId: `${word.id}-fr`, wordId: word.id, text: word.fr, lang: "fr" },
        ]);

        // On s’assure qu’il y ait exactement TOTAL_CARDS éléments
        const cardsToUse = cardPairs.slice(0, TOTAL_CARDS);
        const shuffled = cardsToUse.sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setWon(false);
    };

    useEffect(() => {
        initializeGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    // on peut relancer le niveau courant
                    initializeGame();
                }
            }, 1500);
        }
    }, [solved, cards, difficulty]);

    // Calcul de template columns pour 12 cartes selon gridCols
    // ex : si gridCols = 4, 12/4 = 3 lignes. la grid est repeat(gridCols)
    const gridTemplate = `repeat(${gridCols}, minmax(0, 1fr))`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Memory Anglais – Français</h1>

            <div className="mb-4 flex gap-4">
                <div>
                    <label htmlFor="gridCols" className="mr-2">Colonnes</label>
                    <input
                        type="number"
                        id="gridCols"
                        min="2"
                        max="6"
                        value={gridCols}
                        onChange={handleColsChange}
                        className="border-2 border-gray-300 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label> Niveau actuel : </label>
                    <span className="ml-2 font-semibold">{difficulty}</span>
                </div>
            </div>

            <div
                className="grid gap-4 mb-4"
                style={{
                    gridTemplateColumns: gridTemplate,
                    width: `min(100%, ${gridCols * 10}rem)`,
                }}
            >
                {cards.map((card, idx) => (
                    <div
                        key={card.uniqueId}
                        onClick={() => handleClick(idx)}
                        className={`w-28 sm:w-32 lg:w-36 aspect-square flex items-center justify-center text-center p-2 text-base sm:text-lg font-semibold rounded-lg cursor-pointer transition-all duration-300 ${
                            isFlipped(idx)
                                ? isSolved(idx)
                                    ? "bg-green-100 text-green-600"
                                    : "bg-cyan-500 text-white"
                                : "bg-gray-300 text-gray-400"
                        }`}
                    >
                        {isFlipped(idx) ? card.text : "?"}
                    </div>
                ))}
            </div>

            {won && (
                <div className="mt-4 text-3xl font-bold text-green-600 animate-bounce">
                    Bravo ! Niveau {difficulty} terminé 🎉
                </div>
            )}
        </div>
    );
};

export default Memory;
