const { webCookieValidator, loginValidator } = require("../../middlewears/auth");
const router = require('express').Router()
const userRouter = require("./user")
const jwt = require('jsonwebtoken')
const Users = require("../../database/models/users");
const reservationsRouter = require("./reservations")
const hotelsRouter = require("./hotels")
const notificationsRouter = require("./notifications")

// Home page route.
router.post('/login', loginValidator, async function(req, res) {
    try {
        const username = req.body.username
        const email = req.body.email
        let payload = {
            // This can be an email as well
            username: username,
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
        const updatedUser = await Users.findOneAndUpdate({
            $or: [{ username: username }, { email: email }]
        }, { sessionKey: token }, {})
        console.log(`[+] Authenticated user: ${username || email}`)
        res.cookie('authorization', token);
        res.send({ auth: true, token: token, usesrId: updatedUser.userId })
    } catch (err) {
        console.log(`Error updating user session key: ${err}`)
        res.sendStatus(500)
    }
})

// About page route.
router.get('/logout', webCookieValidator, async function(req, res) {
    await Users.findOneAndUpdate({ userId: res.userId }, { sessionKey: '' }, {})
    console.log(`Signed user out, userID:  ${res.userId}`)
    res.send();
})

// Nested route
router.use('/user', userRouter)

// Nested route
router.use('/reservations', reservationsRouter)

// Nested route
router.use('/hotels', hotelsRouter)

// Nested route
router.use('/notifications', notificationsRouter)

module.exports = router;