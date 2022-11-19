


async function addReservation() {
    const hotelName = document.getElementById("hotel-name").textContent
    const suiteAmountRooms = document.getElementById("suite-room-amount").value
    const regularRoomAmount = document.getElementById("regular-room-amount").value
    const checkIn = document.getElementById("checkIn").innerHTML
    const checkOut = document.getElementById("checkOut").innerHTML
    fetch('/api/reservations', {
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
            hotelName: hotelName,
            suiteRoomAmount: suiteAmountRooms,
            regularRoomAmount: regularRoomAmount,
            checkIn: checkIn,
            checkOut: checkOut
        })
    }).then(function (response) {
        if (response.status !== 200) {
            alert("You must be logged in")
        } else {
            window.location.href = '/reservations'
        }
    })
}


let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})

hamburgerMenu.addEventListener('click', function () {
    header.classList.toggle('menu-open');

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

