const character = document.getElementById('character');
const obstacle = document.getElementById('obstacle');
let isObstacleAnimating = false;
let isGameOver = false;

function removeInitialMessage() {
    const initialMessage = document.querySelector('h4');
    if (initialMessage) {
        initialMessage.remove();
    }
}


// Character logic //
function toggleCharacterAnimation() {
    if (!isCharacterAnimating() && !isGameOver) {
        character.classList.add('animate');
        setTimeout(() => {
            character.classList.remove('animate');
            if (isCharacterOnObstacle) {
                // Reset the character's position to the bottom of the container after jumping off
                character.style.bottom = '0px';
                isCharacterOnObstacle = false;
            }
        }, 1200); // Adjust to be the same as the character jump animation duration
    }
}


function isCharacterAnimating() {
    return character.classList.contains('animate');
}

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        toggleCharacterAnimation();
        checkCollision(); // Check for collision each time the character jumps
    }
});

// Obstacle logic //
document.addEventListener('keydown', event => {
    if (event.code === 'Enter' && !isGameOver) {
        removeInitialMessage();
        toggleObstacleAnimation();
    }
});

function toggleObstacleAnimation() {
    if (!isObstacleAnimating && !isGameOver) {
        obstacle.classList.add('animate');
        isObstacleAnimating = true;
    }
}

// Collision detection //
let isCharacterOnObstacle = false;

function checkCollision() {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    const isColliding = !(
        characterRect.right < obstacleRect.left || // Character is to the left of the obstacle
        characterRect.left > obstacleRect.right || // Character is to the right of the obstacle
        characterRect.bottom < obstacleRect.top // Character is above the obstacle
    );

    const isLandingOnObstacle = (
        characterRect.bottom + 5 >= obstacleRect.top &&
        characterRect.bottom <= obstacleRect.top + 5 && // Allow a small margin for landing
        characterRect.right > obstacleRect.left &&
        characterRect.left < obstacleRect.right
    );

    if (isLandingOnObstacle && !isCharacterOnObstacle) {
        isCharacterOnObstacle = true;
        character.style.bottom = `${obstacleRect.height}px`; // Adjust character position
        character.classList.remove('animate'); // Stop character animation
    } else if (!isLandingOnObstacle && isCharacterOnObstacle) {
        isCharacterOnObstacle = false;
        character.style.bottom = '0px'; // Reset character position
    }

    if (isColliding && !isLandingOnObstacle) {
        handleGameOver();
    }
}

// Ensure to call checkCollision in a loop or on relevant events
setInterval(checkCollision, 20);

// Handle game over
document.addEventListener('keydown', event => {
    if (event.code === 'Escape' && !isGameOver) {
        handleGameOver();
    }
});
function handleGameOver() {
    isGameOver = true;
    isObstacleAnimating = false; // Stop obstacle animation
    character.classList.remove('animate'); // Stop character animation
    obstacle.classList.remove('animate'); // Ensure obstacle animation is stopped

    // Create and insert the game over message
    const gameOverMessage = document.createElement('p');
    gameOverMessage.textContent = "Game Over, to restart press R";
    const gameContainer = document.querySelector('.game-container');
    gameContainer.appendChild(gameOverMessage);
}

// Function to restart the game
function restartGame() {
    if (isGameOver) {
        isGameOver = false;
        // Reset character and obstacle positions
        character.style.bottom = '0px';
        character.classList.remove('animate');
        obstacle.classList.remove('animate');
        isObstacleAnimating = false;

        // Remove the game over message
        const gameOverMessage = document.querySelector('.game-container p');
        if (gameOverMessage) {
            gameOverMessage.remove();
        }

        // Optionally, restart obstacle animation
        toggleObstacleAnimation();
    }
}

// Add event listener for the 'R' key to restart the game
document.addEventListener('keydown', event => {
    if (event.code === 'KeyR') {
        restartGame();
    }
});
