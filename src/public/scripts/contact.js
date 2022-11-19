
let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');



hamburgerMenu.addEventListener('click', function () {
    header.classList.toggle('menu-open');

})

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})

let logout = document.querySelector('#logout');
logout.addEventListener('click', async e => {
    e.preventDefault();
    await fetch('/auth/logout', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }).then(function (response) {
        if (response.status === 200){
            window.location.href = '/'
        }else{
            alert("Couldn't log user out, please try again")
        }
    })
});