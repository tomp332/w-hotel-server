//Selectors

let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})

hamburgerMenu.addEventListener('click', function () {
    header.classList.toggle('menu-open');

})

/* SmtpJS.com - v3.0.0 */
var Email = {
    send: function (a) {
        return new Promise(function (n, e) {
            a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send";
            var t = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
                n(e)
            })
        })
    },
    ajaxPost: function (e, n, t) {
        var a = Email.createCORSRequest("POST", e);
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            a.onload = function () {
                var e = a.responseText;
                null != t && t(e)
            }, a.send(n)
    },
    ajax: function (e, n) {
        var t = Email.createCORSRequest("GET", e);
        t.onload = function () {
            var e = t.responseText;
            null != n && n(e)
        }, t.send()
    },
    createCORSRequest: function (e, n) {
        var t = new XMLHttpRequest;
        return "withCredentials" in t ? t.open(e, n, !0) :
            "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t
    }
};

function sendEmail() {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "liralgazi@gmail.com",
        Password: "abcs",
        To: 'liralgazi@gmail.com',
        From: document.getElementById("email").value,
        Subject: document.getElementById("subject").value,
        Body: "Name :" + document.getElementById("name").value +
            "<br> Email :" + document.getElementById("email").value +
            "<br> Sunject :" + document.getElementById("subject").value +
            "<br> Message : " + document.getElementById("message").value
    }).then(
        message => alert(message)
    );
}

async function getHotels() {
    const hotels = await fetch('/api/hotels', {
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
    return hotels

}


// Generate google map
async function initMap() {
    const hotels = await getHotels()
    // Init for map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
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
        console.log(response)
        if (response.status === 200 || response.status === 401) {
            window.location.href = '/'
        }
    })
});