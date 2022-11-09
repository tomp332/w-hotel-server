const router = require('express').Router()
const path = require('path')

router.get("/403", function(_, res) {
    let options = {
        root: path.join(path.resolve(__dirname, '..', 'public'))
    };
    res.sendFile('403.html', options)
})

router.get("/", (req, res) => {
    res.render('home.ejs', {});
})

// router.get("/home.ejs", (req, res) => {
//     res.render('login/login.ejs', {});
// })

module.exports = router;