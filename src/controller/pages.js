const router = require('express').Router()
const path = require('path')
const Hotels = require("../database/models/hotels");
const Reservations = require("../database/models/reservations");


router.get("/403", function(_, res) {
    let options = {
        root: path.join(path.resolve(__dirname, '..', 'public'))
    };
    res.sendFile('403.html', options)
})

router.get("/", async(req, res) => {
    try {
        const hotels = await Hotels.find().exec()
        res.render('home.ejs', { hotels: hotels });
    } catch (err) {
        console.log(`Error fetching current hotels in DB, ${err}`)
        res.render('home.ejs', { hotels: [] });
    }
})


router.post("/hotels", async(req, res) => {
    try {
        console.log(req.body)
        const hotelName = req.body.hotelName
        const checkIn = req.body.checkIn
        const checkOut = req.body.checkOut
        const hotel = await Hotels.findOne({ 'hotelName': hotelName }).exec()
        const reservation = await Reservations.findOne({
            'hotelId': hotel.hotelId,
            'checkIn': new Date(2023, 05, 03),
            'checkOut': new Date(2023, 05, 05)
        })
        console.log(reservation)
        if (Object.keys(reservation).length > 0) {
            // The reservation is not available 
            res.render(`hotels/${hotel.hotelId}.ejs`, { hotel: hotel, available: false }, async(err, html) => {
                console.log(`Error fetching reuqired hotel from DB, ${err}`)
                const hotels = await Hotels.find().exec()
                res.render('home.ejs', { hotels: hotels });
            });
        } else {
            // The reservation is available 
            res.render(`hotels/${hotel.hotelId}.ejs`, { hotel: hotel, available: true }, async(err, html) => {
                console.log(`Error fetching reuqired hotel from DB, ${err}`)
                const hotels = await Hotels.find().exec()
                res.render('home.ejs', { hotels: hotels });
            });
        }
    } catch (err) {
        console.log(`Error fetching reuqired hotel from DB, ${err}`)
        const hotels = await Hotels.find().exec()
        res.render('home.ejs', { hotels: hotels });
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