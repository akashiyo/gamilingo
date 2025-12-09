"use client";
import React, { Component } from "react";


class Hangman extends Component {
    static defaultProps = {
        maxWrong: 10,
        wordsToWin: 3,
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
        wordId: null,
        guessed: new Set(),
        correctGuesses: new Set(),
        incorrectGuesses: new Set(),
        loading: true,
        error: null,
        wordsGuessed: 0,
        wordIdsGuessed: [],
        showingWordSuccess: false,
        showWinPopup: false,
        theme: "Foods",
        level: 1,
    };
    awarded = false;

    async fetchRandomWord() {
        try {
            const theme = this.state.theme;
            console.log("🎮 Hangman fetching words for theme:", theme);
            const res = await fetch(`/api/words?theme=${encodeURIComponent(theme)}`, { cache: "no-store" });
            const data = await res.json();
            console.log("📚 Received", data.words?.length || 0, "words for theme:", theme);

            if (!res.ok) {
                throw new Error(data.error || data.message || "Erreur API");
            }

            if (!data.words || data.words.length === 0) {
                throw new Error(`Aucun mot trouvé pour le thème ${theme}`);
            }

            // Filter out words already guessed in this game
            const availableWords = data.words.filter(
                (w) => !this.state.wordIdsGuessed.includes(w.id)
            );

            if (availableWords.length === 0) {
                throw new Error("Plus de mots disponibles");
            }

            const randomWordObj =
                availableWords[Math.floor(Math.random() * availableWords.length)];
            const randomWord = randomWordObj.en.toLowerCase();

            console.log("🎯 Word to guess:", randomWord);

            this.setState({
                answer: randomWord,
                wordId: randomWordObj.id,
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
        // Read theme and level from URL parameters
        const params = new URLSearchParams(window.location.search);
        const themeParam = params.get("theme");
        const theme = themeParam || "Foods";
        const level = Number(params.get("level") || 1);
        
        console.log("🎯 Hangman URL params - theme:", themeParam, "-> using:", theme, ", level:", level);
        console.log("🔗 Full URL:", window.location.href);
        
        this.setState({ theme, level }, () => {
            this.fetchRandomWord();
        });
        
        // Add keyboard listener
        window.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        // Remove keyboard listener
        window.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress = (e) => {
        const key = e.key.toLowerCase();
        // Only handle a-z letters
        if (key.length === 1 && key >= "a" && key <= "z") {
            // Don't process if already guessed or game is over/won
            const { guessed, answer, nWrong, showingWordSuccess, wordsGuessed } = this.state;
            const { maxWrong, wordsToWin } = this.props;
            const gameOver = nWrong >= maxWrong;
            const gameWon = wordsGuessed >= wordsToWin;

            if (!guessed.has(key) && answer && !gameOver && !gameWon && !showingWordSuccess) {
                // Simulate a click event
                this.handleGuess({ target: { value: key } });
            }
        }
    };

    reset = () => {
        this.awarded = false;
        this.setState(
            (ps) => ({
                nWrong: 0,
                guessed: new Set(),
                correctGuesses: new Set(),
                incorrectGuesses: new Set(),
                answer: "",
                wordId: null,
                loading: true,
                error: null,
                wordsGuessed: 0,
                wordIdsGuessed: [],
                showingWordSuccess: false,
                showWinPopup: false,
                theme: ps.theme,
                level: ps.level,
            }),
            () => this.fetchRandomWord()
        );
    };

    nextWord = () => {
        this.setState(
            (ps) => ({
                guessed: new Set(),
                correctGuesses: new Set(),
                incorrectGuesses: new Set(),
                answer: "",
                wordId: null,
                loading: true,
                showingWordSuccess: false,
            }),
            () => this.fetchRandomWord()
        );
    };

    handleWordGuessed = () => {
        const { wordId, wordsGuessed, wordIdsGuessed } = this.state;
        const newWordsGuessed = wordsGuessed + 1;
        const newWordIdsGuessed = [...wordIdsGuessed, wordId];

        this.setState({
            wordsGuessed: newWordsGuessed,
            wordIdsGuessed: newWordIdsGuessed,
            showingWordSuccess: true,
        });
    };

    guessWord = () => {
        return this.state.answer
            .split("")
            .map((ltr) => (this.state.guessed.has(ltr) || ltr === " " ? ltr : "_"));
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
                    className={`${baseClasses} ${colorClasses} disabled:cursor-not-allowed rounded-4xl` }

                >
                    {ltr}
                </button>
            );
        });
    };

    render() {
        const { maxWrong, wordsToWin, images } = this.props;
        const { nWrong, answer, loading, error, wordsGuessed, showingWordSuccess } = this.state;

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
                        className="bg-purple-500 text-white px-6 py-2 rounded-4xl hover:bg-purple-600 shadow-lg"

                    >
                        Réessayer
                    </button>
                </div>
            );
        }

        const wordGuessed = this.guessWord().join("") === answer;
        const gameOver = nWrong >= maxWrong;
        const gameWon = wordsGuessed >= wordsToWin;
        const { showWinPopup, theme } = this.state;
        let gameState = this.generateButtons();

        // Handle word success transition
        if (wordGuessed && !showingWordSuccess && !gameWon && wordsGuessed < wordsToWin) {
            setTimeout(() => this.handleWordGuessed(), 0);
        }

        // Show win popup when game is won
        if (gameWon && !showWinPopup) {
            setTimeout(() => this.setState({ showWinPopup: true }), 0);
        }

        if (showingWordSuccess && !gameWon) {
            gameState = (
                <div className="col-span-6 flex flex-col items-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-green-600 text-xl font-bold">Mot trouvé !</p>
                    <p className="text-gray-600 font-medium">Mots devinés: {wordsGuessed} / {wordsToWin}</p>
                    <button
                        onClick={this.nextWord}
                        className="bg-purple-500 text-white px-8 py-3 rounded-full hover:bg-purple-600 shadow-lg font-semibold transition-all hover:scale-105"
                    >
                        Mot suivant
                    </button>
                </div>
            );
        } else if (gameWon) {
            gameState = (
                <div className="col-span-6 flex flex-col items-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">🎉🏆</div>
                    <p className="text-green-600 text-xl font-bold">Félicitations ! Vous avez gagné !</p>
                    <p className="text-gray-600 font-medium">{wordsToWin} mots devinés !</p>
                    <button
                        onClick={this.reset}
                        className="bg-purple-500 text-white px-8 py-3 rounded-full hover:bg-purple-600 shadow-lg font-semibold transition-all hover:scale-105"
                    >
                        Rejouer
                    </button>
                </div>
            );
        } else if (gameOver) {
            gameState = (
                <div className="col-span-6 flex flex-col items-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">😢</div>
                    <p className="text-red-600 text-xl font-bold">Perdu !</p>
                    <p className="text-gray-600 font-medium">Mots devinés: {wordsGuessed} / {wordsToWin}</p>
                    <button
                        onClick={this.reset}
                        className="bg-purple-500 text-white px-8 py-3 rounded-full hover:bg-purple-600 shadow-lg font-semibold transition-all hover:scale-105"
                    >
                        Réessayer
                    </button>
                </div>
            );
        }

        const progress = ((maxWrong - nWrong) / maxWrong) * 100;

        return (
            <div className="bg-purple-200 min-h-screen flex flex-col px-4 py-6">

                {/* Win Popup Modal */}
                {showWinPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl animate-bounce-in">
                            <div className="text-6xl mb-4">🎉🏆🎉</div>
                            <h2 className="text-2xl font-bold text-purple-700 mb-2">Félicitations !</h2>
                            <p className="text-gray-600 mb-2">Vous avez gagné le Hangman !</p>
                            <p className="text-purple-600 font-semibold mb-4">Thème: {theme}</p>
                            <p className="text-green-600 font-bold mb-6">+50 XP gagnés !</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={this.reset}
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
                )}

                {/* Container principal */}
                <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
                    {/* Progress and Errors info in one line */}
                    <div className="mb-4 w-full max-w-md bg-white rounded-2xl p-4 shadow-md flex items-center justify-between">
                        <div className="text-purple-700 font-semibold">
                            Mots: {wordsGuessed} / {wordsToWin}
                        </div>
                        {!wordGuessed && !gameOver && !showingWordSuccess && (
                            <div className="text-gray-600 font-medium">
                                Erreurs: {nWrong} / {maxWrong}
                            </div>
                        )}
                    </div>

                    {/* Mot à deviner */}
                    <div className="text-3xl sm:text-4xl font-bold tracking-[0.3em] sm:tracking-[0.5em] mb-6 text-gray-800 text-center">
                        {gameOver ? answer.toUpperCase() : this.guessWord().join(" ").toUpperCase()}
                    </div>

                    {/* Image du pendu dans un cadre blanc avec bordure pointillée */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 mb-6 w-full max-w-sm border-2 border-dashed border-purple-300 shadow-lg">
                        <img
                            src={images[Math.min(nWrong, images.length - 1)]}
                            alt={`Step ${nWrong}`}
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Alphabet - grille 6 colonnes */}
                    <div className="grid grid-cols-6 gap-2 mb-4 w-full max-w-md">
                        {gameState}
                    </div>
                </div>
            </div>
        );
    }
}

export default Hangman;

// Award XP when the user wins the full game (3 words). We check for victory and call the award endpoint once.
// This module runs in the browser; we attach a small watcher to the class prototype.
(function attachAwardWatcher() {
    const originalRender = Hangman.prototype.render;

    Hangman.prototype.render = function () {
        const result = originalRender.apply(this, arguments);

        try {
            const wordsToWin = this.props.wordsToWin || 3;
            const gameWon = this.state.wordsGuessed >= wordsToWin;
            
            if (gameWon && !this.awarded) {
                this.awarded = true;
                // determine level and theme from URL
                const params = new URLSearchParams(window.location.search);
                const level = Number(params.get("level") || 1);
                const theme = params.get("theme") || "Foods";

                // Record all word wins for progress tracking
                if (this.state.wordIdsGuessed && this.state.wordIdsGuessed.length > 0) {
                    this.state.wordIdsGuessed.forEach((wordId) => {
                        fetch("/api/knownwords/v2", {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ wordId }),
                        }).catch((err) => console.error("record word win error", err));
                    });
                }

                fetch("/api/xp/award", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ game: "hangman", level, theme, xp: 50 }),
                })
                    .then((res) => {
                        if (res.ok) window.dispatchEvent(new Event("xp-updated"));
                    })
                    .catch((err) => console.error("award xp error", err));
            }
        } catch (e) {
            // ignore
        }

        return result;
    };
})();