const {webCookieValidator} = require("../middlewears/auth");
const router = require('express').Router()

router.put('/', webCookieValidator, async function (req, res) {

})

module.exports = router;