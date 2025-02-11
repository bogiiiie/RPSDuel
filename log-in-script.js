const form = document.getElementById("log-in-form"); // Attach event to form
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// INITIAL USERNAME IF IN GUEST MODE
localStorage.setItem("active-user", "Guest User"); 
console.log(localStorage.getItem("active-user"));


document.getElementById("guest-mode-btn").addEventListener("click", function () {
    window.location.href = "game-area.html";
    localStorage.setItem("active-user", "Guest User");
});

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload

    const usernames = Object.keys(localStorage);

    if (usernames.includes(usernameInput.value)) {
        
        const object = JSON.parse(localStorage.getItem(usernameInput.value));
        const confirmedPassword = object.password;

        if(passwordInput.value == confirmedPassword){

            Swal.fire({
                title: "Success!",
                text: "Logged In Successfully!",
                icon: "success",
                confirmButtonText: "OK",
                position: "top",
            }).then(() => {
                localStorage.setItem("active-user", usernameInput.value);
                window.location.href = "game-area.html";
            });

        } else{

            Swal.fire({
                title: "Error!",
                text: "Incorrect password.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }

    } else {
        
        Swal.fire({
            title: "Error!",
            text: "Username not found.",
            icon: "error",
            confirmButtonText: "Try Again",
        });
    }

});