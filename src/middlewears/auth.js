const jwt = require("jsonwebtoken");
const Users = require("../database/models/users");

const loginValidator = async(req, res, next) => {
    try {
        let username = req.body.username
        let password = req.body.password
        let email = req.body.email
        if ((username || email) && password) {
            const user = await Users.findOne({ $or: [{ username: username, password: password }, { email: email, password: password }] }).exec()
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

const webCookieValidator = async(req, res, next) => {
    try {
        let token = req.cookies.authorization
        if (token == null) return res.redirect('/login');
        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                console.log(`[-] Token err , ${err.message}`)
                res.redirect('/login')

                //return res.sendStatus(403);
            }
            Users.findOne({ sessionKey: req.cookies.authorization }, function(err, user) {
                if (err) {
                    console.log(`[-] Eror finding user in database, ${err}`)
                    res.redirect('/login')

                    //res.sendStatus(401)
                } else {
                    if (user) {
                        res.auth = true
                        console.log(user.isAdmin ? "[+] Authenticating an admin" : "[+] Authenticating regular user")

                        // If this was made by an admin then it can have permissions to act as the specified user
                        res.userId = (user.isAdmin) ? req.body.userId : user.userId

                        next();
                    } else {
                        console.log(`[-] Found no user with the token: ${token}`)
                        res.redirect('/login')
                    }
                }
            })
        });
    } catch (err) {
        console.log(`[-] Client error authenticating, ${err}`)
        res.redirect('/login')
    }
};

const adminWebCookieValidate = async(req, res, next) => {
    try {
        let token = req.cookies.authorization
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.JWT_SECRET.toString(), {}, (err) => {
            if (err) {
                console.log(`[-] Token err , ${err.message}`)
                return res.sendStatus(403);
            }
            Users.findOne({ username: process.env.ADMIN_USERNAME }, function(err, admin) {
                if (err) {
                    console.log(`[-] Error finding and validating admin from database, ${err}`)
                    res.sendStatus(401)
                } else {
                    if (admin) {
                        if (admin.sessionKey === token) {
                            // The request was made by an admin user
                            res.auth = true
                            res.userId = admin.userId
                            next();
                        } else {
                            // The request was not made by an admin
                            console.log(`[-] Unauthorized request made by user withuot admin permissions`)
                            res.sendStatus(401)
                        }
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
}
module.exports = { webCookieValidator, loginValidator }