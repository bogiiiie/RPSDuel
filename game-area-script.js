const startBtn = document.getElementById("start-game-btn");
const currentUserContainer = document.getElementById("current-user");
const currentUsernameLabel = document.getElementById("current-username");
const currentUserWinningsLabel = document.getElementById("winnings-value");
const winningsContainer = document.getElementById("winnings");
const winningsValue = document.getElementById("winnings-value");
const playGameContainer = document.getElementById("play-game-container");
const [playerWeaponDiv, computerWeaponDiv] = [...document.querySelectorAll(".weapon-div")];
const timerDisplay = document.getElementById("time-left-num");
const timeLeftLabel = document.getElementById("time-left-label");
const [rockBtn, paperBtn, scissorsBtn] = [...document.querySelectorAll(".choices-btn")];
const choicesBtns = [rockBtn, paperBtn, scissorsBtn];
const resetBtn = document.getElementById("reset-btn");
const [playerScore, , computerScore] = [...document.querySelectorAll(".score-char")];
const gameResultContainer = document.getElementById("game-result-container");
const resultTitle = document.getElementById("result-title");
const resultSubtitle = document.getElementById("result-subtitle");
const resultIcon = document.getElementById("result-icon");
const playAgainBtn = document.getElementById("play-again-btn");
const quitGameBtn = document.getElementById("quit-game-btn");
const leaderboardsContainer = document.getElementById("leaderboards");

const currentUsername = localStorage.getItem("active-user");
currentUsernameLabel.textContent = currentUsername;

console.log(currentUserContainer);

let playerChoice = "";
let computerChoice = "";
let isGameRunning = false; // Prevent multiple games from starting

startBtn.addEventListener("click", function () {
    if (!isGameRunning) {
        isGameRunning = true;

        startBtn.style.display = "none";
        startBtn.style.position = "absolute";
        startBtn.style.visibility = "hidden";
        currentUserContainer.style.display = "flex";
        currentUserContainer.style.position = "relative";
        currentUserContainer.style.visibility = "visible";

        if(currentUsername == "Guest User"){
            currentUserWinningsLabel.style.display = "none";
            winningsContainer.style.position = "absolute";
            winningsContainer.style.visibility = "hidden";
        }
        else{
            winningsContainer.style.display = "flex";
            winningsContainer.style.position = "relative";
            winningsContainer.style.visibility = "visible";

            const json = JSON.parse(localStorage.getItem(currentUsername))
            winningsValue.textContent = json.winnings;
            console.log(json.winnings)
        }
        gameLoop();
    }
});

playAgainBtn.addEventListener("click", function () {
    resetGame();
    isGameRunning = true;
    gameLoop();
});

function gameLoop() {

    if (parseInt(playerScore.textContent) < 3 && parseInt(computerScore.textContent) < 3) {
        startRound(() => {
            setTimeout(gameLoop, 1000); // Wait 1 second before starting the next round
        });
    } else {
        isGameRunning = false; // Stop the loop when someone wins
        
        if(playerScore.textContent>computerScore.textContent){
            resultIcon.src = "assets/winner.png"
            resultTitle.textContent = "You Win!";
            resultSubtitle.textContent = "Congratulations! You've won the game.";

            if(!(currentUsername == "Guest User")){

                const json = JSON.parse(localStorage.getItem(currentUsername));
                json.winnings = Number(json.winnings) + 1;
                const updatedWinnings = json.winnings;
                const passwordWinningsvalue = {
                    password: json.password,
                    winnings: updatedWinnings
                    }
                const jsonStringify = JSON.stringify(passwordWinningsvalue);
                
                localStorage.setItem(currentUsername, jsonStringify);

                winningsValue.textContent = updatedWinnings;
            }
        }
        else{
            resultIcon.src = "assets/loser.png"
            resultTitle.textContent = "Game Over";
            resultSubtitle.textContent = "Better luck next time!";
        }
        playGameContainer.style.display = "none";
        playGameContainer.style.position = "absolute";
        leaderboards.style.display = "flex";
        leaderboards.style.position = "relative";
        leaderboards.style.visibility = "visible";
        gameResultContainer.style.display = "flex";
        gameResultContainer.style.position = "relative";
        gameResultContainer.style.visibility = "visible";

        //display leaderboards
        // 1. Get the sorted user data from localStorage.
        const sortedUsers = getSortedLocalStorageUsers();
  
        // 2. Display the top three users by winnings (excluding "active-user").
        displayTopThree(sortedUsers);

    }
}

function startRound(callback) {
    resetRound();

    playGameContainer.style.display = "flex";
    playGameContainer.style.position = "relative";
    gameResultContainer.style.display = "none";
    gameResultContainer.style.position = "absolute";
    gameResultContainer.style.visibility = "hidden";
    leaderboards.style.display = "none";
    leaderboards.style.position = "absolute";
    leaderboards.style.visibility = "hidden";

    let countdown = parseInt(timerDisplay.textContent);
    playerChoice = "";

    // Set computer's choice early
    const randomIndex = Math.floor(Math.random() * choicesBtns.length);
    computerChoice = choicesBtns[randomIndex].querySelector("img").alt;


    choicesBtns.forEach(button => button.addEventListener("click", handleChoiceClick));

    const countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = countdown;

        if (countdown <= 0) {
            timerDisplay.textContent = "";
            clearInterval(countdownInterval);
            lockChoice(callback);
        }
    }, 1000);
}

function handleChoiceClick(event) {
    choicesBtns.forEach(btn => {
        btn.style.backgroundColor = "";
        btn.querySelector("img").style.filter = "";
    });

    const clickedButton = event.currentTarget;
    clickedButton.style.backgroundColor = "var(--color-purple)";
    clickedButton.querySelector("img").style.filter = "invert(100%) brightness(100%)";

    playerChoice = clickedButton.querySelector("img").alt;
}

function lockChoice(callback) {
    choicesBtns.forEach(button => button.removeEventListener("click", handleChoiceClick));

    if (!playerChoice) {
        playerChoice = "question-mark";
        timeLeftLabel.textContent = "Computer Wins! You didn't choose.";
        computerScore.textContent = parseInt(computerScore.textContent) + 1;
    } else {
        determineWinner();
    }

    playerWeaponDiv.querySelector("img").src = `assets/${playerChoice.toLowerCase()}.png`;
    computerWeaponDiv.querySelector("img").src = `assets/${computerChoice.toLowerCase()}.png`;

    setTimeout(callback, 1000);
}

function determineWinner() {

    let result = "";

    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else if (
        (playerChoice === "Rock" && computerChoice === "Scissors") ||
        (playerChoice === "Paper" && computerChoice === "Rock") ||
        (playerChoice === "Scissors" && computerChoice === "Paper")
    ) {
        result = "You Win!";
        playerScore.textContent = parseInt(playerScore.textContent) + 1;
    } else {
        result = "Computer Wins!";
        computerScore.textContent = parseInt(computerScore.textContent) + 1;
    }

    timeLeftLabel.textContent = result;

}

resetBtn.addEventListener("click", function () {
    resetGame();
});

function resetRound() {
    timerDisplay.textContent = 3;
    timeLeftLabel.textContent = "Time Left:";
    playerChoice = "";
    choicesBtns.forEach(button => {
        button.style.backgroundColor = "var(--color-white)";
        button.querySelector("img").style.filter = "invert(30%) sepia(100%) saturate(500%) hue-rotate(210deg) brightness(100%) contrast(100%)";
    });
    playerWeaponDiv.querySelector("img").src = "assets/question-mark.png";
    computerWeaponDiv.querySelector("img").src = "assets/question-mark.png";
}

function resetGame() {
    isGameRunning = false;
    playerScore.textContent = "0";
    computerScore.textContent = "0";
    resetRound();
}


// Function to retrieve and sort users from localStorage.
// The users are sorted in ascending order by winnings, and the "active-user" entry (if any) is appended at the end.
function getSortedLocalStorageUsers() {
    let users = [];
    let activeUser = null;
  
    // Loop through all keys in localStorage.
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
  
      // Check if the key is "active-user"
      if (key === "active-user") {
        try {
          activeUser = { username: key, data: JSON.parse(value) };
        } catch (e) {
          activeUser = { username: key, data: value };
        }
      } else {
        try {
          // Assume the value is a JSON string with user details.
          let userData = JSON.parse(value);
          // Add the username (i.e., the key) to the user object.
          userData.username = key;
          users.push(userData);
        } catch (error) {
          console.error(`Error parsing JSON for key "${key}":`, error);
        }
      }
    }
  
    // Sort the user objects in ascending order based on the winnings property.
    users.sort((a, b) => {
      let aWinnings = Number(a.winnings) || 0;
      let bWinnings = Number(b.winnings) || 0;
      return aWinnings - bWinnings;
    });
  
    // Append the "active-user" entry to the end if it exists.
    if (activeUser !== null) {
      users.push(activeUser);
    }
  
    return users;
  }

  quitGameBtn.addEventListener("click", () => {
    localStorage.setItem("active-user", "Guest User");
    window.location.href = "log-in-form.html";
  });
  
  
  // Function to display the top three users by winnings.
  // It accepts the sorted array (from getSortedLocalStorageUsers) as a parameter.
  // The "active-user" is filtered out. If there are fewer than three users,
  // missing entries are filled with "?" for both username and winnings.
  function displayTopThree(sortedUsers) {
    // Exclude any entry with username "active-user" or with no winnings (or winnings equal to 0).
    let filteredUsers = sortedUsers.filter(user => 
      user.username !== "active-user" && Number(user.winnings) > 0
    );
  
    // Sort in descending order (highest winnings first).
    filteredUsers.sort((a, b) => Number(b.winnings) - Number(a.winnings));
  
    // Prepare an array for the top three.
    let topThree = [];
  
    // Get up to three entries; fill in with placeholders if insufficient data.
    for (let i = 0; i < 3; i++) {
      if (i < filteredUsers.length) {
        topThree.push({
          username: filteredUsers[i].username,
          winnings: filteredUsers[i].winnings
        });
      } else {
        topThree.push({
          username: "?",
          winnings: "?"
        });
      }
    }
  
    // Update the DOM elements inside the leaderboards section.
    const topUsersList = document.getElementById("top-users");
    if (!topUsersList) {
      console.error("Element with id 'top-users' not found.");
      return;
    }
  
    // Assume the ordered list already has 3 <li> elements.
    const listItems = topUsersList.getElementsByTagName("li");
  
    // Loop over the top three results and update each corresponding <li>.
    for (let i = 0; i < 3; i++) {
      const li = listItems[i];
      if (li) {
        // Update the username span.
        const usernameSpan = li.querySelector(".username");
        if (usernameSpan) {
          usernameSpan.textContent = topThree[i].username;
        }
  
        // Update the winnings value span.
        const winningsValueSpan = li.querySelector(".winnings-value");
        if (winningsValueSpan) {
          winningsValueSpan.textContent = topThree[i].winnings;
        }
      }
    }
  
    // Optionally, return the top three array.
    return topThree;
  }
  
  
  
