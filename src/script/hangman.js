"use client";
import React, { Component } from "react";
import Image from "next/image";
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

    // 🔹 Récupère un mot aléatoire via ton API
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
                "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-md font-semibold shadow-md transition duration-200";

            let colorClasses = "bg-cyan-500 text-white hover:bg-cyan-400";

            if (isGuessed) {
                if (isCorrect) {
                    colorClasses = "bg-green-100 text-green-600 border-2 border-green-500";
                } else if (isIncorrect) {
                    colorClasses = "bg-red-100 text-red-600 border-2 border-red-500";
                }
            }

            return (
                <button
                    key={ltr}
                    value={ltr}
                    onClick={this.handleGuess}
                    disabled={isGuessed}
                    className={`${baseClasses} ${colorClasses} disabled:opacity-60 disabled:cursor-not-allowed`}
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
                <div className="bg-indigo-700 text-gray-500 min-h-screen flex items-center justify-center">
                    <p className="text-lg animate-pulse">Chargement du mot...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-indigo-700 text-gray-500 min-h-screen flex flex-col items-center justify-center text-center gap-4">
                    <p className="text-red-400 font-semibold">Erreur : {error}</p>
                    <button
                        onClick={this.reset}
                        className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-400 shadow-md"
                    >
                        Réessayer
                    </button>
                </div>
            );
        }

        const isWinner = this.guessWord().join("") === answer;
        const gameOver = nWrong >= maxWrong;
        let gameState = this.generateButtons();

        if (isWinner) gameState = <p className="text-green-400 text-xl">You Won!</p>;
        if (gameOver) gameState = <p className="text-red-400 text-xl">You Lost!</p>;

        return (
            <div className="bg-sky-200 text-gray-500 min-h-screen flex items-center justify-center px-4 py-8">

                <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* 🔹 Bloc image du pendu */}
                    <div className="flex flex-col items-center">
                        <Image
                            src={images[Math.min(nWrong, images.length - 1)]}
                            alt={`Step ${nWrong}`}
                            width={250}
                            height={250}
                            className="mx-auto drop-shadow-lg"
                            priority
                        />
                        <p className="mt-4 text-lg font-medium">
                            Guessed wrong: <span className="text-cyan-300">{nWrong}</span>
                        </p>
                    </div>

                    {/* 🔹 Bloc lettres + mot */}
                    <div className="flex flex-col items-center gap-6 w-full md:w-1/2">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-cyan-500">
                            Hangman Foods
                        </h1>

                        {/* Mot à deviner */}
                        <p className="tracking-widest text-3xl sm:text-4xl font-mono mb-2">
                            {gameOver ? answer : this.guessWord().join(" ")}
                        </p>

                        {/* Alphabet */}
                        <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 justify-center">
                            {gameState}
                        </div>

                        {/* Bouton reset */}
                        <button
                            onClick={this.reset}
                            className="mt-6 bg-cyan-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-cyan-400 transition"
                        >
                            🔁 Reset Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Hangman;
