console.log("Script gestartet");
/* =====================================
MONSTER-FUTTER
===================================== */

const words = [

    { word: "Hund", type: "Nomen" },
    { word: "Katze", type: "Nomen" },
    { word: "Baum", type: "Nomen" },
    { word: "Auto", type: "Nomen" },
    { word: "Haus", type: "Nomen" },
    { word: "Maus", type: "Nomen" },
    { word: "Pferd", type: "Nomen" },
    { word: "Hexe", type: "Nomen" },
    { word: "Löwe", type: "Nomen" },
    { word: "Hose", type: "Nomen" },

    { word: "der", type: "Artikel" },
    { word: "die", type: "Artikel" },
    { word: "das", type: "Artikel" },
    { word: "ein", type: "Artikel" },
    { word: "eine", type: "Artikel" },

    { word: "ich", type: "Pronomen" },
    { word: "du", type: "Pronomen" },
    { word: "wir", type: "Pronomen" },
    { word: "er", type: "Pronomen" },
    { word: "sie", type: "Pronomen" },
    { word: "es", type: "Pronomen" },

    { word: "schön", type: "Adjektiv" },
    { word: "traurig", type: "Adjektiv" },
    { word: "müde", type: "Adjektiv" },
    { word: "wütend", type: "Adjektiv" },
    { word: "klein", type: "Adjektiv" },
    { word: "groß", type: "Adjektiv" },
    { word: "lustig", type: "Adjektiv" },
    { word: "schnell", type: "Adjektiv" },
    { word: "windig", type: "Adjektiv" },

    { word: "laufen", type: "Verb" },
    { word: "stricken", type: "Verb" },
    { word: "gucken", type: "Verb" },
    { word: "denken", type: "Verb" },
    { word: "springen", type: "Verb" },
    { word: "spielen", type: "Verb" },
    { word: "essen", type: "Verb" },
    { word: "trinken", type: "Verb" },
    { word: "zählen", type: "Verb" },


];

/* =====================================
DOM-ELEMENTE
===================================== */

const wordElement = document.getElementById("word");
const feedback = document.getElementById("feedback");

const starsElement = document.getElementById("stars");
const levelElement = document.getElementById("level");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const progressBar = document.getElementById("progressBar");

const eatSound = document.getElementById("eatSound");
const wrongSound = document.getElementById("wrongSound");
const levelSound = document.getElementById("levelSound");

const monsters = document.querySelectorAll(".monster");

/* =====================================
SPIELDATEN
===================================== */
console.log("Vor localStorage");
let score = 0;
let stars = 0;
let level = 1;
let currentWord = null;

let highscore = 0;

try {
    highscore =
        Number(localStorage.getItem("monsterHighscore")) || 0;
} catch (error) {
    console.log("Highscore-Speicher nicht verfügbar.");
    highscore = 0;
}

highscoreElement.textContent = highscore;
/* =====================================
HILFSFUNKTIONEN
===================================== */

function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function nextWord() {
    currentWord = randomWord();
    wordElement.textContent = currentWord.word;
}

function updateDisplay() {

    scoreElement.textContent = score;
    starsElement.textContent = stars;
    levelElement.textContent = level;
    highscoreElement.textContent = highscore;

    progressBar.style.width =
        `${(score % 10) * 10}%`;
}

function saveHighscore() {

    if (score > highscore) {

        highscore = score;

        try {
            localStorage.setItem(
                "monsterHighscore",
                highscore
            );
        } catch (error) {
            console.log("Highscore konnte nicht gespeichert werden.");
        }

        highscoreElement.textContent =
            highscore;
    }
}
console.log("Nach localStorage");
function playSound(sound) {

    if (!sound) return;

    sound.currentTime = 0;

    sound.play().catch(() => {});
}

function animateMonster(monster, animationClass) {

    monster.classList.remove("happy");
    monster.classList.remove("wrong");

    void monster.offsetWidth;

    monster.classList.add(animationClass);

    setTimeout(() => {

        monster.classList.remove(animationClass);

    }, 800);
}

function setMouth(monster, emoji) {

    const mouth =
        monster.querySelector(".mouth");

    if (!mouth) return;

    mouth.textContent = emoji;

    setTimeout(() => {

        mouth.textContent = "👄";

    }, 1000);
}

function checkLevelUp() {

    if (score > 0 && score % 10 === 0) {

        level++;
        stars++;

        feedback.innerHTML =
            `⭐ Level ${level} erreicht!`;

        playSound(levelSound);
    }
}

/* =====================================
DRAG & DROP
===================================== */

wordElement.addEventListener("dragstart", (event) => {

    event.dataTransfer.setData(
        "text/plain",
        currentWord.word
    );
});

monsters.forEach(monster => {

    monster.addEventListener("dragover", (event) => {

        event.preventDefault();

    });

    monster.addEventListener("drop", (event) => {

        event.preventDefault();

        const monsterType =
            monster.dataset.type;

        if (monsterType === currentWord.type) {

            score++;

            saveHighscore();

            animateMonster(
                monster,
                "happy"
            );

            setMouth(
                monster,
                "😋"
            );

            playSound(eatSound);

            feedback.innerHTML =
                `✅ Richtig! "${currentWord.word}" ist ein ${monsterType}.`;

            checkLevelUp();

        } else {

            animateMonster(
                monster,
                "wrong"
            );

            setMouth(
                monster,
                "😠"
            );

            playSound(wrongSound);

            feedback.innerHTML =
                `❌ Falsch! "${currentWord.word}" gehört zu ${currentWord.type}.`;
        }

        updateDisplay();
        nextWord();
    });
});

/* =====================================
SPIEL START
===================================== */

updateDisplay();

nextWord();

feedback.innerHTML =
    "Ziehe das Wort auf das passende Monster!";
