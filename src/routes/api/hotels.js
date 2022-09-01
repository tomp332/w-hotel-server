const {webCookieValidator} = require("../../middlewears/auth");
const uuid4 = require("uuid4");
const Hotels = require("../../database/models/hotels");
const router = require('express').Router()

// Create new hotel
router.post('/', webCookieValidator, async function (req, res) {
    try {
        const newHotel = new Hotels({
            hotelName: req.body.hotelName,
            hotelId: uuid4(),
            rating: req.body.rating,
            address: req.body.address,
            pricePerNight: req.body.pricePerNight,
            location: req.body.location,
            guestReviews: req.body.guestReviews,
        })
        await newHotel.save()
        console.log("[+] Added new hotel successfully")
        res.send()
    } catch (err) {
        console.log(`[-] Failed to add new hotel. ${err}`)
        res.sendStatus(400)
    }
})

// Update hotel information
router.put('/', webCookieValidator, async function (req, res) {
    try {
        const hotelId = req.body.hotelId
        let hotel = await Hotels.findOne({hotelId: hotelId}).exec()
        hotel.hotelName = req.body.hotelName && req.body.hotelName || hotel.hotelName
        hotel.rating = req.body.rating && req.body.rating || hotel.rating
        hotel.address = req.body.address && req.body.address || hotel.address
        hotel.pricePerNight = req.body.pricePerNight && req.body.pricePerNight || hotel.pricePerNight
        hotel.location = req.body.location && req.body.location || hotel.location
        hotel.guestReviews = req.body.guestReviews && req.body.guestReviews || hotel.guestReviews
        await hotel.save()
        console.log(`[+] Changed hotel ID ${hotelId} information`)
        res.send()
    } catch (err) {
        console.log(`[-] Failed to change hotel information, ${err}`)
        res.sendStatus(400)
    }
})

module.exports = router;