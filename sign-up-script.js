const form = document.getElementById("sign-up-form"); // Attach event to form
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

document.getElementById("guest-mode-btn").addEventListener("click", function () {
    window.location.href = "game-area.html";
});

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload

    const usernames = Object.keys(localStorage);

    if (usernames.includes(usernameInput.value)) {
        Swal.fire({
            title: "Error!",
            text: "Username already exists",
            icon: "error",
            confirmButtonText: "OK",
        });
    } else {
        if (passwordInput.value === confirmPasswordInput.value) {
            const initialWinnings = 0;
            const passwordWinningsvalue = {
                        password: passwordInput.value,
                        winnings: initialWinnings
                        }
            storeData(usernameInput.value, JSON.stringify(passwordWinningsvalue));
            Swal.fire({
                title: "Success!",
                text: "Signed Up Successfully!",
                icon: "success",
                confirmButtonText: "OK",
                position: "top",
            }).then(() => {
                window.location.href = "log-in-form.html"; // Redirect to the login page
            });

            // Retrieve and parse the JSON data properly
            const json = JSON.parse(localStorage.getItem(usernameInput.value));
            if (json) {
                console.log(usernameInput.value, json.password, json.winnings);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to retrieve user data.",
                    icon: "error",
                    confirmButtonText: "Try Again",
                });
            }

        } else {
            Swal.fire({
                title: "Error!",
                text: "Error. Please check your password",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    }
});

function storeData(username, passwordAndWinnings) {
    localStorage.setItem(username, passwordAndWinnings);
}