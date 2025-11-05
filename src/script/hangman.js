"use client";
import React, { Component } from "react";
import "../app/hangman/hangman.css";

class Hangman extends Component {
    static defaultProps = {
        maxWrong: 10,
        images: [
            "/images/hangman/img0.png",
            "/images/hangman/img1.png",
            "/images/hangman/img2.png",
            "/images/hangman/img3.png",
            "/images/hangman/img4.png",
            "/images/hangman/img5.png",
            "/images/hangman/img6.png",
            "/images/hangman/img7.png",
            "/images/hangman/img8.png",
            "/images/hangman/img9.png",
            "/images/hangman/img10.png",
        ],
    };

    state = {
        nWrong: 0,
        answer: "",
        guessed: new Set(),
        correctGuesses: new Set(),
        incorrectGuesses: new Set(),
        loading: true,
        error: null,
    };

    async fetchRandomWord() {
        try {
            const res = await fetch("/api/words?theme=Foods", { cache: "no-store" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || "Erreur API");
            }

            if (!data.words || data.words.length === 0) {
                throw new Error("Aucun mot trouvé pour le thème Foods");
            }

            const randomWord =
                data.words[Math.floor(Math.random() * data.words.length)].en.toLowerCase();

            this.setState({
                answer: randomWord,
                loading: false,
                error: null,
            });
        } catch (err) {
            this.setState({
                loading: false,
                error: err.message,
            });
            console.error("❌ Erreur lors de la récupération du mot :", err);
        }
    }

    componentDidMount() {
        this.fetchRandomWord();
    }

    reset = () => {
        this.setState(
            {
                nWrong: 0,
                guessed: new Set(),
                correctGuesses: new Set(),
                incorrectGuesses: new Set(),
                answer: "",
                loading: true,
                error: null,
            },
            () => this.fetchRandomWord()
        );
    };

    guessWord = () => {
        return this.state.answer
            .split("")
            .map((ltr) => (this.state.guessed.has(ltr) ? ltr : "_"));
    };

    handleGuess = (e) => {
        const ltr = e.target.value;
        this.setState((ps) => {
            const isCorrect = ps.answer.includes(ltr);
            const newGuessed = new Set(ps.guessed).add(ltr);
            const newCorrectGuesses = new Set(ps.correctGuesses);
            const newIncorrectGuesses = new Set(ps.incorrectGuesses);

            if (isCorrect) {
                newCorrectGuesses.add(ltr);
            } else {
                newIncorrectGuesses.add(ltr);
            }

            return {
                guessed: newGuessed,
                correctGuesses: newCorrectGuesses,
                incorrectGuesses: newIncorrectGuesses,
                nWrong: ps.nWrong + (isCorrect ? 0 : 1),
            };
        });
    };

    generateButtons = () => {
        return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr) => {
            const isGuessed = this.state.guessed.has(ltr);
            const isCorrect = this.state.correctGuesses.has(ltr);
            const isIncorrect = this.state.incorrectGuesses.has(ltr);

            let baseClasses =
                "w-11 h-11 flex items-center justify-center font-bold transition duration-200 uppercase text-base border-2";

            let colorClasses = "bg-white text-gray-600 border-gray-300 hover:bg-gray-50";

            if (isGuessed) {
                if (isCorrect) {
                    colorClasses = "bg-green-200 text-green-700 border-green-400";
                } else if (isIncorrect) {
                    colorClasses = "bg-red-200 text-red-600 border-red-400";
                }
            }

            return (
                <button
                    key={ltr}
                    value={ltr}
                    onClick={this.handleGuess}
                    disabled={isGuessed}
                    className={`${baseClasses} ${colorClasses} disabled:cursor-not-allowed`}
                >
                    {ltr}
                </button>
            );
        });
    };

    render() {
        const { maxWrong, images } = this.props;
        const { nWrong, answer, loading, error } = this.state;

        if (loading) {
            return (
                <div className="bg-purple-200 min-h-screen flex items-center justify-center">
                    <p className="text-lg animate-pulse text-purple-700">Chargement du mot...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-purple-200 min-h-screen flex flex-col items-center justify-center text-center gap-4 px-4">
                    <p className="text-red-600 font-semibold">Erreur : {error}</p>
                    <button
                        onClick={this.reset}
                        className="bg-purple-500 text-white px-6 py-2 rounded-full-30 hover:bg-purple-600 shadow-lg"
                        style={{border-radius="30%"}}
                    >
                        Réessayer
                    </button>
                </div>
            );
        }

        const isWinner = this.guessWord().join("") === answer;
        const gameOver = nWrong >= maxWrong;
        let gameState = this.generateButtons();

        if (isWinner) gameState = <p className="text-green-600 text-xl font-bold">You Won! 🎉</p>;
        if (gameOver) gameState = <p className="text-red-600 text-xl font-bold">You Lost! 😢</p>;

        const progress = ((maxWrong - nWrong) / maxWrong) * 100;

        return (
            <div className="bg-purple-200 min-h-screen flex flex-col px-4 py-6">
                {/* Header avec progression */}
                <div className="flex items-center justify-between mb-6 max-w-md mx-auto w-full">
                    <button
                        onClick={this.reset}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-md hover:bg-gray-50"
                    >
                        ←
                    </button>

                    <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-green-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700 shadow-md">
                        Level 1
                    </div>
                </div>

                {/* Container principal */}
                <div className="max-w-md mx-auto w-full flex flex-col items-center">
                    {/* Mot à deviner */}
                    <div className="text-4xl font-bold tracking-[0.5em] mb-8 text-gray-800">
                        {gameOver ? answer.toUpperCase() : this.guessWord().join(" ").toUpperCase()}
                    </div>

                    {/* Image du pendu dans un cadre blanc avec bordure pointillée */}
                    <div className="bg-white rounded-3xl p-8 mb-8 w-full max-w-sm border-2 border-dashed border-purple-300 shadow-lg">
                        <img
                            src={images[Math.min(nWrong, images.length - 1)]}
                            alt={`Step ${nWrong}`}
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Alphabet - grille 6 colonnes */}
                    <div className="grid grid-cols-6 gap-2 mb-6 w-full max-w-sm">
                        {gameState}
                    </div>

                    {/* Info erreurs */}
                    {!isWinner && !gameOver && (
                        <p className="text-gray-600 text-sm">
                            Erreurs: {nWrong} / {maxWrong}
                        </p>
                    )}
                </div>
            </div>
        );
    }
}

export default Hangman;