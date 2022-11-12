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


function sendData(event) {

    const XHR = new XMLHttpRequest();

    XHR.addEventListener('error', (event) => {
        alert('Oops! Something went wrong.');

    });
    var hotelName = document.getElementById("hotel-choice").value;
    var checkIn = document.getElementById("check-in").value;
    var checkOut = document.getElementById("check-out").value;

    // Set up our request
    XHR.open('POST', '/hotels');
    XHR.setRequestHeader('Content-Type', 'application/json')
    alert("Executed")

    // Send our FormData object; HTTP headers are set automatically
    XHR.send(JSON.stringify({
        "hotelName": hotelName,
        "checkIn": checkIn,
        "checkOut": checkOut
    }));
}

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
        if (response.status === 200 || response.status === 401 ) {
            window.location.href = '/'
        }
    })
});