const router = require('express').Router()

// Update user reservation
const {webCookieValidator} = require("../../middlewears/auth")
const Reservations = require("../../database/models/reservations")
const uuid4 = require("uuid4");

router.put('/', webCookieValidator, async function (req, res) {
    try {
        const reservationId = req.body.reservationId
        let reservation = await Reservations.findOne({reservationId: reservationId}).exec()
        reservation.hotelId = req.body.hotelId && req.body.hotelId || reservation.hotelId
        reservation.userId = req.body.userId && req.body.userId || reservation.userId
        reservation.checkIn = req.body.checkIn && req.body.checkIn || reservation.checkIn
        reservation.checkOut = req.body.checkOut && req.body.checkOut || reservation.checkOut
        await reservation.save()
        console.log(`[+] Successfully changed reservation ID ${reservationId} information`)
        res.send()
    } catch (err) {
        console.log(`[-] Failed to change reservation information, ${err}`)
        res.sendStatus(400)
    }
})

router.post('/', webCookieValidator, async function (req, res) {
    try {
        const newReservation = new Reservations({
            hotelId: req.body.hotelId,
            userId: req.body.userId,
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
module.exports = router;