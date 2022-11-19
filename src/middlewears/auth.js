const jwt = require("jsonwebtoken");
const Users = require("../database/models/users");
const Hotels = require("../database/models/hotels");

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
const validCookieExists = function (req, res, next) {
    try {
        let token = req.cookies.authorization
        if (token == null) {
            res.auth = false
            return next()
        }
        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                res.auth = false
                return next()
            } else {
                Users.findOne({sessionKey: req.cookies.authorization}, async (err, user) => {
                    if (err) {
                        res.auth = false
                        return next()
                    } else {
                        if (user) {
                            res.auth = true
                            res.user = user
                            return next();
                        } else {
                            res.auth = false
                            return next()
                        }
                    }
                })
            }
        });
    } catch (err) {
        res.auth = false
        return next()
    }
}


const webCookieValidator = async (req, res, next) => {
    const hotels = await Hotels.find().exec()
    res.auth = false
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
                        console.log(`[-] Found no user with valid token`)
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

const checkIfLoggedIn = (req, res, next) => {
    res.auth = false
    let token = req.cookies.authorization
    if (token == null) {
        next()
    } else {
        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                next()
            }
            Users.findOne({sessionKey: req.cookies.authorization}, async (err, user) => {
                if (err) {
                    next()
                } else {
                    if (user) {
                        res.auth = true
                        res.user = user
                        console.log(user.isAdmin ? "[+] Authenticating an admin" : "[+] Authenticating regular user")
                        // If this was made by an admin then it can have permissions to act as the specified user
                        res.userId = (user.isAdmin) ? req.body.userId : user.userId
                        next();
                    } else {
                        console.log(`[-] Found no user with valid token`)
                        return res.sendStatus(401)
                    }
                }
            })
        })

    }
}

const webCookieValidatorNoRender = async (req, res, next) => {
    res.auth = false
    try {
        let token = req.cookies.authorization
        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                console.log(`[-] Token err , ${err.message}`)
                return res.sendStatus(401)
            }
            Users.findOne({sessionKey: req.cookies.authorization}, async (err, user) => {
                if (err) {
                    console.log(`[-] Error finding user in database, ${err}`)
                    return res.sendStatus(401)
                } else {
                    if (user) {
                        res.auth = true
                        res.user = user
                        console.log(user.isAdmin ? "[+] Authenticating an admin" : "[+] Authenticating regular user")
                        // If this was made by an admin then it can have permissions to act as the specified user
                        res.userId = (user.isAdmin) ? req.body.userId : user.userId
                        next();
                    } else {
                        console.log(`[-] Found no user with valid token`)
                        return res.sendStatus(401)
                    }
                }
            })
        });
    } catch (err) {
        console.log(`[-] Client error authenticating, ${err}`)
        return res.sendStatus(401)
    }
};


module.exports = {webCookieValidator, loginValidator, validCookieExists, webCookieValidatorNoRender, checkIfLoggedIn}