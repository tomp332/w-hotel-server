//login/sing up form function


//login error message-
function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

let pas;
const loginForm = document.querySelector("#login");
const createAccountForm = document.querySelector("#createAccount");

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });
});

//fetch login
loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    await fetch('/auth/login', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            username: e.target[0].value,
            password: e.target[1].value
        })
    }).then(function (response) {
        if (response.status !== 200) {
            setFormMessage(loginForm, "error", "Invalid username/password provided");
        } else {
            console.log(response.user);
            window.location.href = '/user'
        }
    })
});


//sign up validations
document.querySelectorAll(".form__input").forEach(inputElement => {
    inputElement.addEventListener("blur", e => {
        if (e.target.id === "signupUsername" && e.target.value.length < 6) {
            setInputError(inputElement, "Username must be at least 6 characters");
        }
        if ((e.target.id === "signupUsername" || e.target.id === "firstName" || e.target.id === "lastName") && !(/^[A-Za-z0-9]*$/.test(e.target.value))) {
            setInputError(inputElement, "it must be only characters");
        }
        if (e.target.id === "email" && !e.target.value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            setInputError(inputElement, "Wrong email validation");
        }
        if (e.target.id === "password" && e.target.value.length < 8) {
            setInputError(inputElement, "Passwords length must be atleast 8 characters");
        }
        if (e.target.id === "password") {
            pas = e.target.value;
        }
        if (e.target.id === "confirm_password" && e.target.value !== pas) {
            setInputError(inputElement, "Passwords do not match");
            const button = document.getElementById("signUp_btn");
            button.disabled = true;
        }
        if (e.target.id === "confirm_password" && e.target.value === pas) {
            const button = document.getElementById("signUp_btn");
            button.disabled = false;
        }

    });
    inputElement.addEventListener("input", e => {
        clearInputError(inputElement);
    });

});


async function signUp(event) {
    event.preventDefault()
    await fetch('/api/user', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            username:document.getElementById('signupUsername').value,
            email: document.getElementById('email').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            password: document.getElementById('password').value
        })
    }).then(function (response) {
        if (response.status !== 200){
            setFormMessage(createAccountForm, "error", "An account with this username/email already exists");
        } else {
            window.location.href = 'user'
        }
    })
}


//menu code
// let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})

hamburgerMenu.addEventListener('click', function () {
    header.classList.toggle('menu-open');
})










