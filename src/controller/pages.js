const router = require('express').Router()
const path = require('path')
const Hotels = require("../database/models/hotels");
const Reservations = require("../database/models/reservations");
const bodyParser = require("body-parser");


router.get("/403", function (_, res) {
    let options = {
        root: path.join(path.resolve(__dirname, '..', 'public'))
    };
    res.sendFile('403.html', options)
})

router.get("/", async (req, res) => {
    try {
        const hotels = await Hotels.find().exec()
        res.render('home.ejs', {hotels: hotels});
    } catch (err) {
        console.log(`Error fetching current hotels in DB, ${err}`)
        res.render('home.ejs', {hotels: []});
    }
})

router.post("/hotels", async (req, res) => {
    try {
        console.log(req.body)
        const hotelName = req.body.hotelName
        const checkIn = req.body.checkIn
        const checkOut = req.body.checkOut
        const hotel = await Hotels.findOne({ 'hotelName': hotelName }).exec()
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
// router.get("/hotels", (req, res) => {
//     res.render('login.ejs', {});
// })
// router.get("/home", (req, res) => {
//     res.render('login.ejs', {});
// })


module.exports = router;
module.exports = router;