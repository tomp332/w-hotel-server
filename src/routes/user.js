const router = require('express').Router()
const moment = require("moment")
const uuid4 = require("uuid4")



// Home page route.
const {webCookieValidator} = require("../middlewears/auth");
const Users = require("../database/models/users");
const jwt = require("jsonwebtoken");

// Get user information
router.get('/:userId?', webCookieValidator, async function (req, res) {
    try {
        let userId = req.params.userId
        const users = await Users.findOne({userId: userId}).exec()
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
router.delete('/:userId?', webCookieValidator, async function (req, res) {
    await Users.findOneAndDelete({userId: res.userId})
    console.log(`[+] Successfully deleted user with ID: ${res.userId}`)
    res.send();
})

// Update user data
router.put('/', webCookieValidator, function (req, res) {
    res.send();
})

// New user
router.post('/', async function (req, res) {
    try {
        const userId = uuid4()
        const username = req.body.username
        const password = req.body.password
        const newUser = new Users({userId: userId, username: username, password: password})
        await newUser.save(function (err) {
            if (err) {
                console.log(`[-] Error adding new user or user already exists: ${err}`)
                res.status(500).send("Error adding new user or user already exists")
            } else{

                let payload = {
                    username: username
                }
                let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
                res.send({
                    userId: userId,
                    token: token
                })
            }
        })
    } catch (e) {
        console.log(`[-] Exception was thrown adding new user: ${e}`)
        res.sendStatus(403).send("Bad request")
    }
})

module.exports = router;