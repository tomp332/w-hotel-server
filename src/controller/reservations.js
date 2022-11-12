const router = require('express').Router()

// Update user reservation
const {webCookieValidator} = require("../middlewears/auth")
const Reservations = require("../database/models/reservations")
const uuid4 = require("uuid4");
const Hotels = require("../database/models/hotels");

// Update reservation info
router.put('/', webCookieValidator, async function (req, res) {
    try {
        const reservationId = req.body.reservationId
        let reservation = await Reservations.findOne({reservationId: reservationId, userId: res.userId}).exec()
        if (!reservation) {
            res.json("No reservation found by that id").status(404)
            return
        }
        console.log(`[+] Found reservation ${reservation.reservationId} for modifying`)
        reservation.hotelId = req.body.hotelId && req.body.hotelId || reservation.hotelId
        reservation.userId = req.body.userId && req.body.userId || reservation.userId
        reservation.checkIn = req.body.checkIn && req.body.checkIn || reservation.checkIn
        reservation.checkOut = req.body.checkOut && req.body.checkOut || reservation.checkOut
        await reservation.save()
        console.log(`[+] Successfully changed reservation ID ${reservationId} information`)
        res.send()
    } catch (err) {
        console.log(`[-] Failed to change reservation information, ${err}`)
        res.json("No reservation was found or you've entered an incorrect reservation format").status(400)
    }
})

// Add new reservation
router.post('/', webCookieValidator, async function (req, res) {
    try {
        const newReservation = new Reservations({
            hotelId: req.body.hotelId,
            userId: res.userId,
            reservationId: uuid4(),
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut
        })
        await newReservation.save()
        console.log(`[+] Added new reservation to database, ID: ${newReservation.reservationId}`)
        res.send()
    } catch (err) {
        console.log(`[-] Error adding new reservation, ${err}`)
        res.sendStatus(400)
    }
})

// Get all reservations in DB that are associated with the current userId
router.get('/', webCookieValidator, async function (req, res) {
    try {
        const reservations = await Reservations.find({userId: res.userId}).select('-_id -updatedAt').exec()
        res.json(reservations)
        console.log(`[+] Fetched ${Object.keys(reservations).length} reservations, for user ID: ${res.userId}`)
    } catch (err) {
        console.log(`Error fetching current reservations in DB, ${err}`)
        res.json('Error fetching current reservations in DB').status(500)
    }
})

module.exports = router;