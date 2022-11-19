
let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');



hamburgerMenu.addEventListener('click', function () {
    header.classList.toggle('menu-open');

})

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})


async function getHotels() {
    return await fetch('/api/hotels', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }).then((response) => response.json())
        .then((data) => {
            return data
        })
}


// Generate google map
async function initMap() {
    const hotels = await getHotels()
    // Init for map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: {lat: 32.0853, lng: 34.7818},
    });

    for (const hotel of hotels) {
        const contentString = "<h3>" + hotel.hotelName + "</h3>"


        let marker = new google.maps.Marker({
            position: hotel.location,
            map,
            title: "Main marker",
        })
        let infoWindow = new google.maps.InfoWindow({
            content: contentString
        });
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

    }
}

window.initMap = initMap;


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
        if (response.status === 200) {
            window.location.href = '/'
        } else {
            alert("Couldn't log user out, please try again")
        }
    })
});