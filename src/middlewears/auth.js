const jwt = require("jsonwebtoken");
const Users = require("../database/models/users");
const Hotels = require("../database/models/hotels");
const Reservations = require("../database/models/reservations");

const loginValidator = async (req, res, next) => {
    try {
        let username = req.body.username
        let password = req.body.password
        let email = req.body.email
        if ((username || email) && password) {
            const user = await Users.findOne({
                $or: [{username: username, password: password}, {
                    email: email,
                    password: password
                }]
            }).exec()
            if (user !== null) {
                console.log(`[+] Authenticating login credentials for user: ${username || email}`)
                next();
            } else {
                console.log(`[-] No user was found for this login information`)
                res.status(401).json("No user was found for this login information")
            }
        } else {
            console.log(`[-] No proper login information was provided for login`)
            res.sendStatus(401)
        }
    } catch (err) {
        console.log(`[-] Error parsing login request for authentication purpose ${err}`);
        res.sendStatus(400)
    }
}

const webCookieValidator = async (req, res, next) => {
    const hotels = await Hotels.find().exec()
    try {
        let token = req.cookies.authorization
        if (token == null) return res.render('home.ejs', {hotels: hotels});

        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                console.log(`[-] Token err , ${err.message}`)
                res.render('login.ejs', {})
            }
            Users.findOne({sessionKey: req.cookies.authorization}, async (err, user) => {
                if (err) {
                    console.log(`[-] Error finding user in database, ${err}`)
                    res.render('home.ejs', {hotels: hotels})
                } else {
                    if (user) {
                        res.auth = true
                        res.user = user
                        console.log(user.isAdmin ? "[+] Authenticating an admin" : "[+] Authenticating regular user")
                        // If this was made by an admin then it can have permissions to act as the specified user
                        res.userId = (user.isAdmin) ? req.body.userId : user.userId
                        next();
                    } else {
                        console.log(`[-] Found no user with the token: ${token}`)
                        res.render('home.ejs', {hotels: hotels})
                    }
                }
            })
        });
    } catch (err) {
        console.log(`[-] Client error authenticating, ${err}`)
        res.render('home.ejs', {hotels: hotels})
    }
};

module.exports = {webCookieValidator, loginValidator}