const router = require('express').Router()

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next()
    else
        res.redirect('/fail')
}


// Home page
router.get("/home", ensureAuthenticated, (req, res) => {
    res.send(`Welcome to the WikiHotel page, ${req.user.displayName}`);
})

// Forbidden page
router.get("/fail", (req, res) => {
    res.status(403).json("Failed to authenticate")
});

module.exports = router