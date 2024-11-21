document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.querySelector(".button-auth");
    const outButton = document.querySelector(".button-out");
    const modalAuth = document.querySelector(".modal-auth");
    const modalDialogAuth = document.querySelector(".modal-dialog-auth");
    const closeAuthButton = document.querySelector(".close-auth");
    const logInForm = document.getElementById("logInForm");
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const userNameSpan = document.querySelector(".user-name");

    authButton.addEventListener("click", () => {
        modalAuth.style.display = "flex";
        loginInput.style.borderColor = "";
        document.body.style.overflow = "hidden";
    });

    closeAuthButton.addEventListener("click", () => {
        modalAuth.style.display = "none";
        document.body.style.overflow = "";
    });

    modalAuth.addEventListener("click", (event) => {
        if (!modalDialogAuth.contains(event.target)) {
            modalAuth.style.display = "none";
        document.body.style.overflow = "";
        }
    });

    if (localStorage.getItem("login")) {
        displayLoggedIn(localStorage.getItem("login"));
    } else {
        displayLoggedOut();
    }

    logInForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const login = loginInput.value.trim();

        if (login) {
            localStorage.setItem("login", login);
            displayLoggedIn(login);
            modalAuth.style.display = "none";
        } else {
            loginInput.style.borderColor = "red";
            alert("Будь ласка, введіть логін.");
        }
    });

    outButton.addEventListener("click", () => {
        localStorage.removeItem("login");
        displayLoggedOut();
    });

    function displayLoggedIn(login) {
        authButton.style.display = "none";
        outButton.style.display = "inline-block";
        userNameSpan.textContent = login;
        userNameSpan.style.display = "inline";
        loginInput.style.borderColor = "";
    }

    function displayLoggedOut() {
        authButton.style.display = "inline-block";
        outButton.style.display = "none";
        userNameSpan.textContent = "";
        userNameSpan.style.display = "none";
        loginInput.value = "";
        passwordInput.value = "";
    }
});
