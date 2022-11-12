const router = require('express').Router()
const facebookRouter = require("./facebook")
const {loginValidator, webCookieValidator} = require("../../middlewears/auth");
const jwt = require("jsonwebtoken");
const Users = require('../../database/models/users')
const Hotels = require("../../database/models/hotels");

// Log user out
router.get('/logout', webCookieValidator, async function (req, res) {
    const hotels = await Hotels.find().exec()
    try {
        const user = await Users.findOneAndUpdate({userId: res.user.userId}, {sessionKey: ""}).exec()
        console.log(`[+] Successfully logged user out, username: ${user.username}`)
        res.send()
    } catch (err) {
        console.log(`Error logging user out: ${err}`)
        res.render("user.ejs", {hotels: hotels})
    }
})

// Home page route.
router.post('/login', loginValidator, async function (req, res) {
    try {
        const username = req.body.username
        const email = req.body.email
        let payload = {
            // This can be an email as well
            username: username,
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
        const updatedUser = await Users.findOneAndUpdate({
            $or: [{username: username}, {email: email}]
        }, {sessionKey: token}, {})
        console.log(`[+] Authenticated user: ${username || email}`)
        res.cookie('authorization', token)
        res.send()
    } catch (err) {
        console.log(`Error updating user session key: ${err}`)
        res.sendStatus(500)
    }
})

//Facebook router
router.use('/facebook', facebookRouter)

module.exports = router