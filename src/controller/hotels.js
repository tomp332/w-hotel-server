const {webCookieValidator} = require("../middlewears/auth");
const uuid4 = require("uuid4");
const Hotels = require("../database/models/hotels");
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
        console.log(`[+] Added new hotel successfully, hotel ID: ${newHotel.hotelId}`)
        res.json("Added new hotel successfully")
    } catch (err) {
        console.log(`[-] Failed to add new hotel. ${err}`)
        res.status(400).json("Received incorrect new hotel format")
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

// Get all hotels in DB
router.get('/', async function (req, res) {
    try {
        const hotels = await Hotels.find().select('-_id -updatedAt').exec()
        res.json(hotels)
        console.log(`[+] Fetched ${Object.keys(hotels).length} hotels`)
    } catch (err) {
        console.log(`Error fetching current hotels in DB, ${err}`)
        res.json('Error fetching current hotels in DB').status(500)
    }
})


// Get all hotels in DB
router.delete('/', webCookieValidator, async function (req, res) {
    try {
        await Hotels.deleteOne({hotelId: req.body.hotelId})
        console.log(`[+] Successfully removed hotel, hotelID: ${req.body.hotelId}`)
    } catch (err) {
        console.log(`[-] Failed to remove hotel, hotelID: ${req.body.hotelId}`)
        res.sendStatus(500)
    }
})


module.exports = router