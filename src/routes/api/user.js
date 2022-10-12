const router = require('express').Router()
const uuid4 = require("uuid4")


// Home page route.
const { webCookieValidator } = require("../../middlewears/auth");
const Users = require("../../database/models/users");
const jwt = require("jsonwebtoken");

// Get user information
router.get('/', webCookieValidator, async function(req, res) {
    try {
        const users = await Users.findOne({ userId: res.userId }).exec()
        if (Object.keys(users).length > 0) {
            res.send(users)
        } else {
            console.log("No users found for GET request")
            res.send("No user or users were found");
        }
    } catch (err) {
        console.log(`[-] Error fetching users, ${err}`)
        res.sendStatus(500);
    }
})

// Delete user data
router.delete('/', webCookieValidator, async function(req, res) {
    await Users.findOneAndDelete({ userId: res.userId })
    console.log(`[+] Successfully deleted user with ID: ${res.userId}`)
    res.send();
})

// New user
router.post('/', async function(req, res) {
    try {
        const userId = uuid4()
        const username = req.body.username
        const password = req.body.password
        const email = req.body.email
        let payload = {
            username: username
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
        const newUser = new Users({ email: email, userId: userId, username: username, password: password, sessionKey: token })
        await newUser.save(function(err) {
            if (err) {
                console.log(`[-] Error adding new user or user already exists: ${err}`)
                res.status(500).send("Error adding new user or user already exists")
            } else {
                console.log(`[+] Created new web user, ${newUser.username}`)
                res.cookie('authorization', token);
                res.send({
                    userId: userId,
                    token: token,
                    auth: true
                })
            }
        })
    } catch (e) {
        console.log(`[-] Exception was thrown adding new user: ${e}`)
        res.sendStatus(403).send("Bad request")
    }
})

module.exports = router;