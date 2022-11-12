//login/sing up form function
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
let matchPasswords = true;
//fetch login
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

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
            console.log(response)
            if (response.status !== 200) {
                setFormMessage(loginForm, "error", "Invalid username/password provided");
            } else {
                window.location.href = '/user'
            }
        })
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length < 6) {
                setInputError(inputElement, "Username must be at least 6 characters");
            }
            if (e.target.id === "signupUsername" &&  !(/^[A-Za-z0-9]*$/.test(e.target.value))) {
                setInputError(inputElement, "Username must be only characters");
            }
            if(e.target.id === "email" && !e.target.value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                setInputError(inputElement, "Wrong email validation");
            }
            let password;
            if(e.target.id === "password"){
                password = e.target.value;
            }
            if(e.target.id === "confirm_password" && e.target.value !== password){
                setInputError(inputElement, "Passwords do NOT match");
                matchPasswords = false;
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});

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


// const form = document.querySelector("#linkCreateAccount")
// eField = form.querySelector(".email"),
//     eInput = eField.querySelector("input"),
//     pField = form.querySelector(".password"),
//     pInput = pField.querySelector("input");





// //create account fetch
document.addEventListener("DOMContentLoaded", () => {
    let createAccount = document.querySelector('#linkCreateAccount');
    createAccount.addEventListener('submit', async e => {
        console.log(e.target);
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
                username: e.target[0].value,
                email: e.target[1].value,
                firstName: e.target[2].value,
                lastName: e.target[3].value,
                password: e.target[4].value
            })
        }).then(function (response) {
            console.log(response)
            if (response.status !== 200 ||  !matchPasswords) {
                setFormMessage(createAccount, "error", "Invalid username/password provided");
            } else {
                window.location.href='/user'
            }
        })
    });
});








