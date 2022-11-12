const router = require('express').Router()
const path = require('path')
const Hotels = require("../database/models/hotels");
const Reservations = require("../database/models/reservations");
const {webCookieValidator} = require("../middlewears/auth");
const Users = require("../database/models/users");


router.get("/403", function (_, res) {
    let options = {
        root: path.join(path.resolve(__dirname, '..', 'public'))
    };
    res.sendFile('403.html', options)
})

router.get("/", webCookieValidator, async (req, res) => {
    const user = await Users.find({sessionKey: req.cookies.authorization}).exec()
    const userReservations = await Reservations.find({userId: res.user.userId}).exec()
    const hotels = await Hotels.find().exec()
    res.render('user.ejs', {hotels: hotels, user: user, userReservations: userReservations})
})

router.post("/hotels", async (req, res) => {
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
            available: hotelAvailable
        });
    } catch (err) {
        console.log(`Error fetching reuqired hotel from DB, ${err}`)
        const hotels = await Hotels.find().exec()
        res.render('home.ejs', {hotels: hotels});
    }
})

router.get("/login", (req, res) => {
    res.render('login.ejs', {});
})


router.get('/user', webCookieValidator, async (req, res) => {
    const user = await Users.find({sessionKey: req.cookies.authorization}).exec()
    const userReservations = await Reservations.find({userId: res.user.userId}).exec()
    const hotels = await Hotels.find().exec()
    console.log("[+] Validated user, rendering user page")
    res.render('user.ejs', {hotels: hotels, user: user[0], userReservations: userReservations})
})

router.get('/contact', (req, res) => {
    res.render("contact.ejs", {})
})

router.get('/hotels', async (req, res) => {
    const hotels = await Hotels.find().exec()
    res.render("hotels.ejs", {hotels: hotels})
})

module.exports = router;