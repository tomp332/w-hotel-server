const router = require('express').Router()
const passport = require("passport")
const strategy = require("passport-facebook")
const FacebookStrategy = strategy.Strategy;
const utils = require('../../utils')
const jwt = require('jsonwebtoken')
const Users = require("../../database/models/users")
const Hotels = require("../../database/models/hotels");

passport.serializeUser(function (user, done) {
    done(null, user);
});


passport.deserializeUser(function (obj, done) {
    done(null, obj);
})

passport.use(
    new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'photos', 'email', 'name']
        },
        async function (accessToken, refreshToken, profile, done) {
            const displayName = profile.displayName
            const {email, first_name, last_name} = profile._json;
            const userData = {
                email: email,
                displayName: displayName,
                firstName: first_name,
                lastName: last_name,
            }
            console.log("[+] Facebook authentication:", userData)
            done(null, profile)
        }
    )
);

router.get("/", passport.authenticate("facebook", {scope: ['email']}));


router.get("/callback", passport.authenticate("facebook", {
    scope: ['email'],
    failureRedirect: "/403"
}), async function (req, res) {
    try {
        let userJson = req.user._json
        req.user = {
            username: `${userJson.first_name}_${userJson.last_name}`,
            firstName: userJson.first_name,
            lastName: userJson.last_name,
            email: userJson.email
        }
        const payload = {
            username: req.user.email
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
        const user = await Users.findOne({email: req.user.email}).select('-_id -updatedAt').exec()
        if (user === null) {
            // Add new user by his facebook email
            await utils.addNewUser(req.user, token)
        } else {
            // Search by user email
            const user = await Users.findOneAndUpdate({email: req.user.email}, {sessionKey: token}, {})
            console.log(`[+] Updated new session key for user, ${user.userId}`)
        }
        console.log(`[+] Successfully initialized user authenticated from facebook`)
        const hotels = await Hotels.find().exec()
        res.cookie('authorization', token)
        res.render('user.ejs', {hotels: hotels, user: req.user})
    } catch (err) {
        res.sendStatus(401)
    }
})

module.exports = router