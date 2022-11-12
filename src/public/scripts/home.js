//Selectors

let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');

window.addEventListener('scroll', function() {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})

hamburgerMenu.addEventListener('click', function() {
    header.classList.toggle('menu-open');

})

/* SmtpJS.com - v3.0.0 */
var Email = {
    send: function(a) {
        return new Promise(function(n, e) {
            a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send";
            var t = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function(e) { n(e) })
        })
    },
    ajaxPost: function(e, n, t) {
        var a = Email.createCORSRequest("POST", e);
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            a.onload = function() {
                var e = a.responseText;
                null != t && t(e)
            }, a.send(n)
    },
    ajax: function(e, n) {
        var t = Email.createCORSRequest("GET", e);
        t.onload = function() {
            var e = t.responseText;
            null != n && n(e)
        }, t.send()
    },
    createCORSRequest: function(e, n) {
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




function sendData() {
    const XHR = new XMLHttpRequest();

    XHR.addEventListener('error', (event) => {
        alert('Oops! Something went wrong.');

    });
    var hotelName = document.getElementById("hotel-dest").value;
    var checkIn = document.getElementById("checkin").value;
    var checkOut = document.getElementById("checkout").value;
    console.log(hotelName)

    // Set up our request
    XHR.open('POST', '/hotels');
    XHR.setRequestHeader('Content-Type', 'application/json')

    // Send our FormData object; HTTP headers are set automatically
    XHR.send(JSON.stringify({
        "hotelName": hotelName,
        "checkIn": checkIn,
        "checkOut": checkOut
    }));
}

var btn = document.getElementById("hotels-search");


function initialize() {
    var mapCanvas = document.getElementById('map');
    var myLatLng = {lat: 44.5403, lng: -78.5463};
    var mapOptions = {
      center: new google.maps.LatLng(myLatLng),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions)
    var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
});
  }
  google.maps.event.addDomListener(window, 'load', initialize);