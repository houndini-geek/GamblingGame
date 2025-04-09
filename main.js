const gameblingObj = [
  { id: "item-1", icon: "👽", value: 10 },
  { id: "item-2", icon: "🌹", value: 20 },
  { id: "item-3", icon: "🎃", value: 40 },
  { id: "item-4", icon: "🎭", value: 60 },
  { id: "item-5", icon: "🚀", value: 80 },
  { id: "item-6", icon: "🛴", value: 10 },
];



// In your JS
document.getElementById("startGameBtn").addEventListener("click", () => {
  // Unlock all sounds
  casinoAmbiance.play().catch(() => {});
  gamblingSound.play().catch(() => {});
  resultSound.play().catch(() => {});
  winSequence.play().catch(() => {});
  lostSequence.play().catch(() => {});
  smallGroupCheerSound.play().catch(() => {});
  humanPainSound.play().catch(() => {});
  slotMachinePayout.play().catch(() => {});
  coinDonationSoud.play().catch(() => {});
  // Play casino ambiance sound
  
  gamblingSound.pause(); // Immediately pause if needed
  
  // Remove the intro screen
  document.getElementById("startScreen").style.display = "none";
});












const gamblingSound = new Audio();
const resultSound = new Audio();

const coinDonationSoud = new Audio();
const casinoAmbiance = new Audio();

const winSequence = new Audio();
const slotMachinePayout = new Audio();
const smallGroupCheerSound = new Audio();

const humanPainSound = new Audio();

const lostSequence = new Audio();

document.addEventListener("DOMContentLoaded", () => {
  loadSounds();
});

function playCasinoAudiance() {
  //Auto play casino ambiance sound \ Notice if auto play failed
  // user interaction is required to play the sound
  casinoAmbiance
    .play()
    .then(() => {
      console.log("Casino ambiance sound is playing.");
    })
    .catch((error) => {
      console.log(
        "Auto play failed. User interaction may be required to play the sound."
      );
      console.error(error);
    });
  // Loop the sound
  casinoAmbiance.loop = true;
  // Set volume
  casinoAmbiance.volume = 0.2;
  // Set playback rate
}

// Initialize cash if not present
if (!localStorage.getItem("cash")) localStorage.setItem("cash", "100");
if (!localStorage.getItem("bot-cash")) localStorage.setItem("bot-cash", "100");

const displayBotCash = document.querySelector(".bot");
const displayPlayerCash = document.querySelector(".cash");
const container = document.querySelector(".container");
const startGambling = document.querySelector(".startGambling");
const gamblingAgain = document.querySelector(".gamblingAgain");
const resetCashBtn = document.querySelector(".resetCash");
const feedbackWrapper = document.querySelector(".feedback-wrapper");
let getPlayerBets = JSON.parse(localStorage.getItem("player-bets")) || [];

// Display bot and player cash
function displayCash() {
  displayBotCash.innerHTML = `BOT: $${localStorage.getItem("bot-cash")}`;
  displayPlayerCash.textContent = `Cash: $${localStorage.getItem("cash")}`;
}
displayCash();

// Render all gambling boxes
container.innerHTML = "";
gameblingObj.forEach((element) => {
  container.innerHTML += `
    <div class="box" data-id="${element.id}" data-value="${element.value}">
      <span>${element.icon}</span>
      <p class='value'>+ ${element.value}</p>
    </div>
  `;
});

const allBoxes = Array.from(document.querySelectorAll(".container .box"));

// Enable "Start Gambling" if bets are present
if (getPlayerBets.length) startGambling.removeAttribute("disabled");

// Handle box selection
allBoxes.forEach((box, index) => {
  const boxId = box.getAttribute("data-id");

  if (getPlayerBets.some((bet) => bet.id === boxId)) {
    box.classList.add("selected");
  }

  box.addEventListener("click", () => handleClick(boxId, index));
});

function handleClick(boxId, index) {
  const cash = Number(localStorage.getItem("cash"));
  const betItem = gameblingObj.find((item) => item.id === boxId);
  const alreadyBet = getPlayerBets.find((b) => b.id === boxId);
  // When placing bets
  coinDonationSoud.src = "Slot-machine-sound/coin-donation-2-180438.mp3";
  coinDonationSoud.play();
  if (alreadyBet) {
    removeBet(boxId, index);
    return;
  }

  if (cash >= betItem.value) {
    getPlayerBets.push(betItem);
    localStorage.setItem("player-bets", JSON.stringify(getPlayerBets));
    localStorage.setItem("cash", String(cash - betItem.value));
    allBoxes[index].classList.add("selected");
    startGambling.removeAttribute("disabled");
    feedbackWrapper.style.display = "none";
    displayCash();
  } else {
    console.warn("Not enough cash to bet.");
    coinDonationSoud.pause();
    feedbackWrapper.style.display = "block";
  }
}

function removeBet(betId, index) {
  const betItem = gameblingObj.find((item) => item.id === betId);
  const cash = Number(localStorage.getItem("cash"));

  getPlayerBets = getPlayerBets.filter((b) => b.id !== betId);
  localStorage.setItem("player-bets", JSON.stringify(getPlayerBets));
  localStorage.setItem("cash", String(cash + betItem.value));
  allBoxes[index].classList.remove("selected");
  feedbackWrapper.style.display = "none";
  if (!getPlayerBets.length) startGambling.setAttribute("disabled", true);
  displayCash();
}

// Start the gambling game
let gameblingInterval;
let winningItemId;

function startGamblingGame() {
  console.log("Game started!");
  startGambling.setAttribute("disabled", true);

  gameblingInterval = setInterval(() => {
    let randomIndex = Math.floor(Math.random() * allBoxes.length);
    allBoxes.forEach((b) => b.classList.remove("shuffling"));
    allBoxes[randomIndex].classList.add("shuffling");
    winningItemId = allBoxes[randomIndex].getAttribute("data-id");
  }, 200);
}

function playSound() {
  gamblingSound.setAttribute(
    "src",
    "Slot-machine-sound/slot-machine-reels-sound-30276.mp3"
  );
  gamblingSound.currentTime = 3;
  gamblingSound.play();
}

function playFinanSound() {
  resultSound.setAttribute(
    "src",
    "Slot-machine-sound/playful-casino-slot-machine-bonus-2-183919.mp3"
  );

  resultSound.play();
}

function stopSound() {
  gamblingSound.pause();
}

// Handle gambling start button
startGambling.addEventListener("click", () => {
  playSound();

  allBoxes.forEach((b) => b.classList.add("invalid"));
  startGamblingGame();

  setTimeout(() => {
    clearInterval(gameblingInterval);
    checkWin(winningItemId);
  }, 7000);
});

// Handle retry
gamblingAgain.addEventListener("click", () => {
  localStorage.removeItem("player-bets");
  location.reload();
});
function checkWin(itemId) {
  stopSound();
  playFinanSound();

  const betMatch = getPlayerBets.find((b) => b.id === itemId);
  let playerCash = Number(localStorage.getItem("cash"));
  let botCash = Number(localStorage.getItem("bot-cash"));

  if (betMatch) {
    // Only reward the amount that matches the winning item
    const winAmount = betMatch.value * 2;

    playerCash += winAmount;
    botCash -= winAmount; // Subtract just what the player wins

    console.log("Player wins!");
    winSequence.play();

    winSequence.addEventListener("ended", () => {
      slotMachinePayout.play();
    });

    if (winAmount >= 120 || winAmount >= 160) {
      smallGroupCheerSound.play();
    }
  } else {
    // Total loss from all bets placed
    const totalLoss = getPlayerBets.reduce((acc, bet) => acc + bet.value, 0);
    botCash += totalLoss;
    humanPainSound.play();
    setTimeout(() => {
      lostSequence.play();
    }, 400);

    console.log("Player lost!");
  }

  localStorage.setItem("cash", String(playerCash));
  localStorage.setItem("bot-cash", String(botCash));
  localStorage.removeItem("player-bets");
  displayCash();
}


function resetCash() {
  localStorage.setItem("cash", "100");
  displayCash();
  location.reload();
}
resetCashBtn.addEventListener("click", () => {  
  resetCash();
}

);





function loadSounds() {
  // Casino Ambiance sounds
  casinoAmbiance.src = "Slot-machine-sound/casino-ambiance-19130.mp3";
  // Play win sequence
  winSequence.src = "Slot-machine-sound/you-win-sequence-2-183949.mp3";
  slotMachinePayout.src =
    "Slot-machine-sound/slot-machine-coin-payout-1-188227.mp3";

  // Play lost sequence
  lostSequence.src =
    "Slot-machine-sound/playful-casino-slot-machine-bonus-2-183919.mp3";
  humanPainSound.src =
    "Slot-machine-sound/mixkit-human-fighter-pain-scream-2768.wav";

  smallGroupCheerSound.src =
    "Slot-machine-sound/mixkit-small-group-cheer-and-applause-518.wav";

  gamblingSound.src = "Slot-machine-sound/slot-machine-reels-sound-30276.mp3";
  gamblingSound.currentTime = 3;

  resultSound.src =
    "Slot-machine-sound/playful-casino-slot-machine-bonus-2-183919.mp3";
}
