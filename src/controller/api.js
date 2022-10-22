const router = require('express').Router()
const userRouter = require("./user")
const reservationsRouter = require("./reservations")
const hotelsRouter = require("./hotels")
const notificationsRouter = require("./notifications")

// Nested route
router.use('/user', userRouter)

// Nested route
router.use('/reservations', reservationsRouter)

// Nested route
router.use('/hotels', hotelsRouter)

// Nested route
router.use('/notifications', notificationsRouter)

module.exports = router;