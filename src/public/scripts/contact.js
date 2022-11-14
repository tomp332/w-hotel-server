
let header = document.querySelector('.header');

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
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