/* =========================================
   INITIAL PAGE
========================================= */

const allPages = document.querySelectorAll(".page");

allPages.forEach(page => {
    page.style.display = "none";
});

const openingSection = document.getElementById("opening-section");
openingSection.style.display = "flex";


/* =========================================
   SECTIONS
========================================= */

const candleSection = document.getElementById("candle-section");
const countdownSection = document.getElementById("countdown-section");
const ageSection = document.getElementById("age-section");
const heartSection = document.getElementById("heart-section");
const birthdaySection = document.getElementById("birthday-section");
const messageSection = document.getElementById("message-section");
const letterSection = document.getElementById("letter-section");
const agreementSection = document.getElementById("agreement-section");
const surpriseSection = document.getElementById("surprise-section");
const photosSection = document.getElementById("photos-section");


/* =========================================
   BUTTONS
========================================= */

const startButton = document.getElementById("start-button");
const ageContinue = document.getElementById("age-continue");
const heartContinue = document.getElementById("heart-continue");
const birthdayContinue = document.getElementById("birthday-continue");
const messageContinue = document.getElementById("message-continue");
const letterContinue = document.getElementById("letter-continue");
const agreeButton = document.getElementById("agree-button");
const memoryButton = document.getElementById("memory-button");


/* =========================================
   MUSIC
========================================= */

const music = document.getElementById("birthday-music");
const musicToggle = document.getElementById("music-toggle");

let musicStarted = false;
let musicMuted = false;

const MUSIC_START = 39;


function vibratePhone() {
    if (navigator.vibrate) {
        navigator.vibrate(60);
    }
}


function startMusic() {

    if (musicStarted) {
        return;
    }

    music.currentTime = MUSIC_START;
    music.volume = 0.35;
    music.muted = false;

    music.play()
        .then(() => {

            musicStarted = true;
            musicMuted = false;

            musicToggle.textContent = "🔊";

        })
        .catch(error => {

            console.log("Music autoplay blocked:", error);

        });

}


musicToggle.addEventListener("click", function () {

    vibratePhone();

    if (!musicStarted) {
        startMusic();
        return;
    }

    if (musicMuted) {

        music.muted = false;
        musicMuted = false;
        musicToggle.textContent = "🔊";

    } else {

        music.muted = true;
        musicMuted = true;
        musicToggle.textContent = "🔇";

    }

});


/* =========================================
   PAGE 1 → PAGE 2
========================================= */

startButton.addEventListener("click", function () {

    openingSection.style.display = "none";
    candleSection.style.display = "flex";

    startMusic();

    vibratePhone();

});


/* =========================================
   CANDLES
========================================= */

const candles = document.querySelectorAll(".candle");
const candleCounter = document.getElementById("candle-counter");

let litCandles = 0;


function candleSound() {

    try {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        const ctx = new AudioContext();

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 800;

        gain.gain.setValueAtTime(0.001, ctx.currentTime);

        gain.gain.exponentialRampToValueAtTime(
            0.12,
            ctx.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.18
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);

    } catch (error) {

        console.log(error);

    }

}


candles.forEach(candle => {

    candle.addEventListener("click", function () {

        if (candle.classList.contains("lit")) {
            return;
        }

        candle.classList.add("lit");

        litCandles++;

        candleCounter.textContent = `${litCandles} / 5 lit`;

        candleSound();
        vibratePhone();

        if (litCandles === 5) {

            setTimeout(startCountdown, 500);

        }

    });

});


/* =========================================
   COUNTDOWN
========================================= */

const countdownNumber = document.getElementById("countdown-number");


function startCountdown() {

    candleSection.style.display = "none";
    countdownSection.style.display = "flex";

    let number = 6;

    countdownNumber.textContent = number;

    const timer = setInterval(function () {

        number--;

        if (number > 0) {

            countdownNumber.textContent = number;

        } else {

            clearInterval(timer);

            countdownNumber.textContent = "✨";

            setTimeout(function () {

                countdownSection.style.display = "none";
                ageSection.style.display = "flex";

            }, 900);

        }

    }, 1000);

}


/* =========================================
   AGE PAGE → HEART GAME
========================================= */

ageContinue.addEventListener("click", function () {

    ageSection.style.display = "none";
    heartSection.style.display = "flex";

    vibratePhone();

});


/* =========================================
   HEART GAME
========================================= */

const heartLeft = document.getElementById("heart-left");
const heartRight = document.getElementById("heart-right");
const heartTarget = document.getElementById("heart-target");
const heartSuccess = document.getElementById("heart-success");

let leftPlaced = false;
let rightPlaced = false;


function completeHeart() {

    const emptyHeart = heartTarget.querySelector(".target-heart");

    if (emptyHeart) {
        emptyHeart.remove();
    }

    const oldHeart = heartTarget.querySelector(".complete-heart");

    if (oldHeart) {
        oldHeart.remove();
    }

    const complete = document.createElement("div");

    complete.className = "complete-heart";
    complete.textContent = "❤️";

    heartTarget.appendChild(complete);

    heartTarget.classList.add("complete");

    heartSuccess.classList.add("show");
    heartContinue.classList.add("show");

    vibratePhone();

}


function checkHeart() {

    if (leftPlaced && rightPlaced) {
        completeHeart();
    }

}


function placeHeartPiece(piece, side) {

    if (side === "left") {

        if (leftPlaced) return;

        leftPlaced = true;

    }

    if (side === "right") {

        if (rightPlaced) return;

        rightPlaced = true;

    }

    piece.classList.add("placed");

    if (leftPlaced && rightPlaced) {

        setTimeout(checkHeart, 250);

    }

}


/* =========================================
   DESKTOP DRAG
========================================= */

function enableDesktopDrag(piece, side) {

    piece.addEventListener("dragstart", function (event) {

        if (piece.classList.contains("placed")) {

            event.preventDefault();
            return;

        }

        piece.classList.add("dragging");

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("heart-side", side);

    });


    piece.addEventListener("dragend", function () {

        piece.classList.remove("dragging");

    });

}


/* =========================================
   HEART TARGET
========================================= */

heartTarget.addEventListener("dragover", function (event) {

    event.preventDefault();

    heartTarget.classList.add("active");

});


heartTarget.addEventListener("dragleave", function () {

    heartTarget.classList.remove("active");

});


heartTarget.addEventListener("drop", function (event) {

    event.preventDefault();

    heartTarget.classList.remove("active");

    const side = event.dataTransfer.getData("heart-side");

    const rect = heartTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const middle = rect.width / 2;

    if (side === "left" && x <= middle) {

        placeHeartPiece(heartLeft, "left");
        return;

    }

    if (side === "right" && x >= middle) {

        placeHeartPiece(heartRight, "right");
        return;

    }

    heartTarget.animate(
        [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(0)" }
        ],
        { duration: 300 }
    );

});


/* =========================================
   MOBILE TOUCH DRAG
========================================= */

function enableTouchDrag(piece, side) {

    let dragging = false;

    piece.addEventListener("touchstart", function () {

        if (piece.classList.contains("placed")) {
            return;
        }

        dragging = true;

        piece.classList.add("dragging");

    }, { passive: true });


    piece.addEventListener("touchmove", function (event) {

        if (!dragging) {
            return;
        }

        const touch = event.touches[0];

        const rect = piece.getBoundingClientRect();

        piece.style.position = "fixed";

        piece.style.left =
            (touch.clientX - rect.width / 2) + "px";

        piece.style.top =
            (touch.clientY - rect.height / 2) + "px";

        piece.style.zIndex = "99999";

    }, { passive: true });


    piece.addEventListener("touchend", function (event) {

        if (!dragging) {
            return;
        }

        dragging = false;

        piece.classList.remove("dragging");

        const touch = event.changedTouches[0];

        const targetRect = heartTarget.getBoundingClientRect();

        const inside =
            touch.clientX >= targetRect.left &&
            touch.clientX <= targetRect.right &&
            touch.clientY >= targetRect.top &&
            touch.clientY <= targetRect.bottom;

        if (inside) {

            const x = touch.clientX - targetRect.left;

            const middle = targetRect.width / 2;

            if (side === "left" && x <= middle) {

                resetPiece(piece);
                placeHeartPiece(piece, "left");
                return;

            }

            if (side === "right" && x >= middle) {

                resetPiece(piece);
                placeHeartPiece(piece, "right");
                return;

            }

        }

        resetPiece(piece);

    }, { passive: true });

}


/* =========================================
   RESET HEART PIECE
========================================= */

function resetPiece(piece) {

    piece.style.position = "";
    piece.style.left = "";
    piece.style.top = "";
    piece.style.zIndex = "";

}


/* Enable dragging */

enableDesktopDrag(heartLeft, "left");
enableDesktopDrag(heartRight, "right");

enableTouchDrag(heartLeft, "left");
enableTouchDrag(heartRight, "right");


/* =========================================
   HEART → ANNIVERSARY
========================================= */

heartContinue.addEventListener("click", function () {

    if (!leftPlaced || !rightPlaced) {
        return;
    }

    heartSection.style.display = "none";
    birthdaySection.style.display = "flex";

});


/* =========================================
   ANNIVERSARY → MESSAGE
========================================= */

birthdayContinue.addEventListener("click", function () {

    birthdaySection.style.display = "none";
    messageSection.style.display = "flex";

});


/* =========================================
   MESSAGE → LETTER
========================================= */

messageContinue.addEventListener("click", function () {

    messageSection.style.display = "none";

    letterSection.style.display = "flex";

    letterSection.scrollTop = 0;

});


/* =========================================
   LETTER → AGREEMENT
========================================= */

letterContinue.addEventListener("click", function () {

    letterSection.style.display = "none";

    agreementSection.style.display = "flex";

    agreementSection.scrollTop = 0;

});


/* =========================================
   PROMISE CHECKBOX
========================================= */

const promiseCheckbox = document.getElementById("promise-checkbox");
const personalPromise = document.getElementById("personal-promise");
const promiseHint = document.getElementById("promise-hint");


promiseCheckbox.addEventListener("change", function () {

    if (promiseCheckbox.checked) {

        personalPromise.classList.add("active");

        agreeButton.disabled = false;

        promiseHint.textContent = "Promise accepted ❤️";

        promiseHint.classList.add("done");

        if (navigator.vibrate) {
            navigator.vibrate([40, 30, 60]);
        }

    } else {

        personalPromise.classList.remove("active");

        agreeButton.disabled = true;

        promiseHint.textContent =
            "Tick the last promise to continue ✨";

        promiseHint.classList.remove("done");

    }

});


/* =========================================
   AGREEMENT → SURPRISE
========================================= */

agreeButton.addEventListener("click", function () {

    if (!promiseCheckbox.checked) {
        return;
    }

    if (navigator.vibrate) {
        navigator.vibrate([50, 40, 80]);
    }

    agreementSection.style.display = "none";

    surpriseSection.style.display = "flex";

});


/* =========================================
   SURPRISE → PHOTOS
========================================= */

memoryButton.addEventListener("click", function () {

    surpriseSection.style.display = "none";

    photosSection.style.display = "flex";

    photosSection.scrollTop = 0;

    currentIndex = 0;

    showPhoto(currentIndex);

});


/* =========================================
   PHOTO GALLERY
========================================= */

const memoryImage = document.getElementById("memory-image");
const memoryTitle = document.getElementById("memory-title");

const previousPhoto = document.getElementById("previous-photo");
const nextPhoto = document.getElementById("next-photo");

const currentPhoto = document.getElementById("current-photo");


/* Nine photos */

const photoNames = [
    "photo1",
    "photo2",
    "photo3",
    "photo4",
    "photo5",
    "photo6",
    "photo7",
    "photo8",
    "photo9"
];


/* Photo titles */

const photoTitles = [

    "My Forever Favourite",

    "Pehle Shagun Check Kar Leta Hoon",

    "Purest Moments",

    "Bridal Glow & Happines",

    "Ghar Ki Yaadein",

    "Always Smiling",

    "Partner In Crime",

    "New Adventures",

    "Happiness Looks Good On You"

];


const extensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".avif"
];


let currentIndex = 0;
let extensionIndex = 0;


/* =========================================
   FIND IMAGE
========================================= */

function findImage(index) {

    extensionIndex = 0;

    memoryImage.style.display = "none";

    tryImage(index);

}


function tryImage(index) {

    if (extensionIndex >= extensions.length) {

        console.log("Image not found:", photoNames[index]);

        return;

    }

    memoryImage.src =
        "images/" +
        photoNames[index] +
        extensions[extensionIndex];

}


/* =========================================
   IMAGE LOAD
========================================= */

memoryImage.onload = function () {

    memoryImage.style.display = "block";

};


/* =========================================
   IMAGE ERROR
========================================= */

memoryImage.onerror = function () {

    extensionIndex++;

    tryImage(currentIndex);

};


/* =========================================
   SHOW PHOTO
========================================= */

function showPhoto(index) {

    if (index < 0) {

        currentIndex = photoNames.length - 1;

    } else if (index >= photoNames.length) {

        currentIndex = 0;

    } else {

        currentIndex = index;

    }

    memoryTitle.textContent = photoTitles[currentIndex];

    currentPhoto.textContent = currentIndex + 1;

    findImage(currentIndex);

}


/* =========================================
   NEXT PHOTO
========================================= */

nextPhoto.addEventListener("click", function () {

    showPhoto(currentIndex + 1);

});


/* =========================================
   PREVIOUS PHOTO
========================================= */

previousPhoto.addEventListener("click", function () {

    showPhoto(currentIndex - 1);

});


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener("keydown", function (event) {

    if (photosSection.style.display !== "flex") {
        return;
    }

    if (event.key === "ArrowRight") {

        showPhoto(currentIndex + 1);

    }

    if (event.key === "ArrowLeft") {

        showPhoto(currentIndex - 1);

    }

});


/* =========================================
   INITIAL PHOTO
========================================= */

showPhoto(0);