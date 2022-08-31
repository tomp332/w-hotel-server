const router = require('express').Router()

// Update user reservation
const {webCookieValidator} = require("../../middlewears/auth");
const Reservations = require("../../database/models/reservations");
router.put('/update', webCookieValidator, async function (req, res) {
    try {
        const reservationId = req.body.reservationId
        const hotels = req.body.hotels
        const user = await Reservations.findOne({reservationId: reservationId}).exec()
        user.userReservations.push(...reservations)
        await user.save()
        console.log("[+] Added new user reservation")
        res.send("Added new user reservation");
    } catch (err) {
        console.log(`[-] Error adding user reservation, ${err}`)
        res.sendStatus(500)
    }
})

module.exports = router;