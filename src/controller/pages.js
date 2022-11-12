const router = require('express').Router()
const path = require('path')
const Hotels = require("../database/models/hotels");
const Reservations = require("../database/models/reservations");
const {webCookieValidator, validCookieExists} = require("../middlewears/auth");
const Users = require("../database/models/users");


router.get("/403", function (_, res) {
    let options = {
        root: path.join(path.resolve(__dirname, '..', 'public'))
    };
    res.sendFile('403.html', options)
})

router.get("/", webCookieValidator, async (req, res) => {
    const user = await Users.find({sessionKey: res.user.sessionKey}).exec()
    const userReservations = await Reservations.find({userId: res.user.userId}).exec()
    const hotels = await Hotels.find().exec()
    res.render('user.ejs', {hotels: hotels, user: user[0], userReservations: userReservations})
})

router.post("/hotels", validCookieExists, async (req, res) => {
    try {
        const hotelName = req.body.hotelName
        const checkIn = req.body.checkIn
        const checkOut = req.body.checkOut
        const hotel = await Hotels.findOne({'hotelName': hotelName}).exec()
        // TODO: Get the date of the check in and check out
        const reservation = await Reservations.findOne({
            'hotelId': hotel.hotelId,
            'checkIn': new Date(2023, 5, 3),
            'checkOut': new Date(2023, 5, 5)
        }) || {}
        let hotelAvailable = Object.keys(reservation).length <= 0
        res.render(`hotels/${hotel.hotelId}.ejs`, {
            hotel: hotel,
            available: hotelAvailable,
            auth: res.auth
        });
    } catch (err) {
        console.log(`Error fetching reuqired hotel from DB, ${err}`)
        const hotels = await Hotels.find().exec()
        res.render('home.ejs', {hotels: hotels, auth: res.auth});
    }
})

router.get("/login", (req, res) => {
    res.render('login.ejs', {});
})

router.get("/reservations", webCookieValidator, async (req, res) => {
    const userReservations = await Reservations.find({userId: res.user.userId}).exec()
    res.render('hotels/reservations.ejs', {userReservations: userReservations, auth: res.auth});
})

router.get('/user', webCookieValidator, async (req, res) => {
    const user = await Users.find({sessionKey: req.cookies.authorization}).exec()
    const hotels = await Hotels.find().exec()
    console.log(`[+] Validated user, rendering user page for user: ${user[0].username}`)
    res.render('user.ejs', {hotels: hotels, user: user[0]})
})

router.get('/contact', validCookieExists, (req, res) => {
    res.render("contact.ejs", {auth: res.auth})
})

router.get('/hotels', validCookieExists, async (req, res) => {
    const hotels = await Hotels.find().exec()
    res.render("hotels/hotels.ejs", {hotels: hotels, auth: res.auth})
})

module.exports = router;