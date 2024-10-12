const character = document.getElementById("character");
const heartContainer = document.querySelector(".heart-container");
const hearts = document.querySelectorAll(".health");
let isObstacleAnimating = false;
let isGameOver = false;
let health = 3;
let timerValue = 20;
let timerInterval;

function removeInitialMessage() {
  const initialMessage = document.querySelector("h4");
  if (initialMessage) {
    initialMessage.remove();
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timerValue > 0) {
      timerValue--;
      document.getElementById("timer").textContent = `Timer: ${timerValue}`; // Update the displayed timer
    } else {
      clearInterval(timerInterval); // Stop the timer when it reaches zero
      handleWin(); // Call the win condition
    }
  }, 1000); // Update every second
}

function handleWin() {
  if (health > 0) {
    isGameOver = true;
    clearInterval(timerInterval); // Stop the timer
    character.classList.remove("animate"); // Stop character animation
    obstacle.classList.remove("animate"); // Ensure obstacle animation is stopped

    // Create and insert the win message
    const winMessage = document.createElement("p");
    winMessage.textContent = "Congratulations! You win! to restart press R";
    const gameContainer = document.querySelector(".game-container");
    gameContainer.appendChild(winMessage);
  }
}

// Character logic //
function toggleCharacterAnimation() {
  if (!isCharacterAnimating() && !isGameOver) {
    character.classList.add("animate");
    setTimeout(() => {
      character.classList.remove("animate");
      if (isCharacterOnObstacle) {
        // Reset the character's position to the bottom of the container after jumping off
        character.style.bottom = "0px";
        isCharacterOnObstacle = false;
      }
    }, 1200); // Adjust to be the same as the character jump animation duration
  }
}

function isCharacterAnimating() {
  return character.classList.contains("animate");
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (!isCharacterAnimating()) {
      toggleCharacterAnimation();
      checkCollision(); // Check for collision each time the character jumps
    }
  }
});

// Obstacle logic //
document.addEventListener("keydown", (event) => {
  if (event.code === "Enter" && !isGameOver) {
    removeInitialMessage();
    startTimer();
    toggleObstacleAnimation();
  }
});

function setRandomObstacleSize(obstacleElement) {
  const randomWidth = Math.random() * (15 - 9) + 6;
  const randomHeight = Math.random() * (4 - 1.5) + 1.5;

  // Set the obstacle's new size
  obstacleElement.style.width = `${randomWidth}rem`;
  obstacleElement.style.height = `${randomHeight}rem`;
}

// delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toggleObstacleAnimation() {
  if (!isObstacleAnimating && !isGameOver) {
    setRandomObstacleSize(obstacle);

    obstacle.classList.add("animate");
    isObstacleAnimating = true;
  }
}

// Collision detection //
let isCharacterOnObstacle = false;
let isReplaced = false;

function checkCollision() {
  let obstacle = document.getElementById("obstacle");
  const characterRect = character.getBoundingClientRect();

  if (isReplaced) {
    obstacle.remove();

    obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.id = "obstacle"; // Set the ID to the same as before
    setRandomObstacleSize(obstacle);
    heartContainer.appendChild(obstacle);

    isReplaced = false;
    obstacle.classList.add("animate");
    isObstacleAnimating = true;
  }
  const obstacleRect = obstacle.getBoundingClientRect();

  const isColliding = !(
    (
      characterRect.right < obstacleRect.left || // Character is to the left of the obstacle
      characterRect.left > obstacleRect.right || // Character is to the right of the obstacle
      characterRect.bottom < obstacleRect.top
    ) // Character is above the obstacle
  );

  const isLandingOnObstacle =
    characterRect.bottom + 5 >= obstacleRect.top &&
    characterRect.bottom <= obstacleRect.top + 5 && // Allow a small margin for landing
    characterRect.right > obstacleRect.left &&
    characterRect.left < obstacleRect.right;

  if (isLandingOnObstacle && !isCharacterOnObstacle) {
    isCharacterOnObstacle = true;
    character.style.bottom = `${obstacleRect.height}px`; // Adjust character position
    character.classList.remove("animate"); // Stop character animation
  } else if (!isLandingOnObstacle && isCharacterOnObstacle) {
    isCharacterOnObstacle = false;
    character.style.bottom = "0px"; // Reset character position
  }
  console.log("health", health);
  if (isColliding && !isLandingOnObstacle && health <= 1) {
    character.classList.add("blink");

    hearts.forEach((heart, idx) => {
      if (idx === health - 1) {
        heart.classList.add("transparent");
        health--;
      }
    });
    character.classList.add("die");

    setTimeout(() => {
      character.classList.remove("blink");
    }, 1000);

    handleGameOver();
  }

  if (isColliding && !isLandingOnObstacle && health > 1) {
    isReplaced = true;
    character.classList.add("blink");

    setTimeout(() => {
      character.classList.remove("blink");
    }, 1000);

    hearts.forEach((heart, idx) => {
      if (idx === health - 1) {
        heart.classList.add("transparent");
        health--;
      }
    });
  }
}

// Ensure to call checkCollision in a loop or on relevant events
let checkInterval = setInterval(checkCollision, 50);

// Handle game over
document.addEventListener("keydown", (event) => {
  if (event.code === "Escape" && !isGameOver) {
    handleGameOver();
  }
});
async function handleGameOver() {
  isGameOver = true;
  isObstacleAnimating = false; // Stop obstacle animation
  character.classList.remove("animate"); // Stop character animation
  obstacle.classList.remove("animate"); // Ensure obstacle animation is stopped

  await delay(1000);

  character.classList.remove("die");

  clearInterval(checkInterval);
  clearInterval(timerInterval);

  // Create and insert the game over message
  const gameOverMessage = document.createElement("p");
  gameOverMessage.textContent = "Game Over, to restart press R";
  const gameContainer = document.querySelector(".game-container");
  gameContainer.appendChild(gameOverMessage);
}

// Function to restart the game
function restartGame() {
  if (isGameOver) {
    isGameOver = false;
    timerValue = 20;
    // Reset character and obstacle positions
    character.style.bottom = "0px";
    character.classList.remove("animate");
    obstacle.classList.remove("animate");
    isObstacleAnimating = false;

    hearts.forEach((heart) => {
      heart.classList.remove("transparent");
    });

    health = 3;
    document.getElementById("timer").textContent = "Timer: 20";

    checkInterval = setInterval(checkCollision, 25);

    // Remove the game over message
    const gameOverMessage = document.querySelector(".game-container p");
    if (gameOverMessage) {
      gameOverMessage.remove();
    }

    // Remove the win message if it exists
    const winMessage = document.querySelector(".game-container p");
    if (winMessage) {
      winMessage.remove();
    }

    // Optionally, restart obstacle animation
    toggleObstacleAnimation();
    startTimer();
  }
}

// Add event listener for the 'R' key to restart the game
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyR") {
    restartGame();
  }
});
