const jwt = require("jsonwebtoken");
const Users = require("../database/models/users");

const loginValidator = async (req, res, next) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            const user = await Users.findOne({username: username, password: password}).exec()
            if (user !== null) {
                console.log(`[+] Authentication login credentials for user: ${username}`)
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
    try {
        let token = req.cookies.authorization
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                console.log(`[-] Token err , ${err.message}`)
                return res.sendStatus(403);
            }
            Users.findOne({sessionKey: req.cookies.authorization}, function (err, user) {
                if (err) {
                    console.log(`[-] Error finding user in database, ${err}`)
                    res.sendStatus(401)
                } else {
                    if (user) {
                        res.auth = true
                        res.userId = user.userId
                        next();
                    } else {
                        console.log(`[-] Found no user with the token: ${token}`)
                        res.sendStatus(401)
                    }
                }
            })
        });
    } catch (err) {
        console.log(`[-] Client error authenticating, ${err}`)
        res.sendStatus(401)
    }
};

module.exports = {webCookieValidator, loginValidator}