const router = require('express').Router()
const facebookRouter = require("./facebook")
const { loginValidator } = require("../../middlewears/auth");
const jwt = require("jsonwebtoken");
const Users = require('../../database/models/users')

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
        res.render('home', { user: updatedUser })
    } catch (err) {
        console.log(`Error updating user session key: ${err}`)
        res.sendStatus(500)
    }
})

//Facebook router
router.use('/facebook', facebookRouter)

module.exports = router