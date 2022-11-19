const router = require('express').Router()
const path = require('path')
const Hotels = require("../database/models/hotels");
const Reservations = require("../database/models/reservations");
const {webCookieValidator, validCookieExists, checkIfLoggedIn} = require("../middlewears/auth");
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
    console.log("[+] Is user an admin:", res.user.isAdmin)
    res.render('user.ejs', {hotels: hotels, user: user[0], userReservations: userReservations})
})

router.get('/hotel', checkIfLoggedIn, async (req, res) => {
    try {
        const hotelName = req.query.hotelName
        const checkIn = req.query.checkIn.split('-')
        const checkOut = req.query.checkOut.split('-')
        const hotel = await Hotels.findOne({'hotelName': hotelName}).exec()
        const reservation = await Reservations.findOne({
            'hotelId': hotel.hotelId,
            'checkIn': new Date(checkIn[0], checkIn[1], checkIn[2]),
            'checkOut': new Date(checkOut[0], checkOut[1], checkOut[2])
        }) || {}
        let hotelAvailable = Object.keys(reservation).length <= 0
        res.render(`hotels/currentHotel.ejs`, {
            hotel: hotel,
            available: hotelAvailable,
            auth: res.auth,
            checkIn: req.query.checkIn,
            checkOut: req.query.checkOut
        });
    } catch (err) {
        console.log(`[-] Error fetching required hotel from DB, ${err}`)
        const hotels = await Hotels.find().exec()
        res.render('home.ejs', {
            hotels: hotels,
            auth: true
        });
    }
})


router.get("/login", (req, res) => {
    res.render('login.ejs', {});
})

router.get("/reservations", webCookieValidator, async (req, res) => {
    const userReservations = await Reservations.find({userId: res.user.userId}).exec()
    res.render('hotels/reservations.ejs', {userReservations: userReservations});
})

router.get('/user', webCookieValidator, async (req, res) => {
    const user = await Users.find({sessionKey: req.cookies.authorization}).exec()
    const hotels = await Hotels.find().exec()
    console.log(`[+] Validated user, rendering user page for user: ${user[0].username}`)
    console.log("[+] Is user an admin:", res.user.isAdmin)
    if(res.user.isAdmin ) {
        const allReservations = await Reservations.find().exec()
        res.render('admin.ejs', {
            hotels: hotels,
            user: user[0],
            allReservations: allReservations})
    } else
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