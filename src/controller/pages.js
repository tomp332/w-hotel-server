const router = require('express').Router()
const path = require('path')

router.get("/403", function(_, res) {
    let options = {
        root: path.join(path.resolve(__dirname, '..', 'public'))
    };
    res.sendFile('403.html', options)
})

router.get("/", (req, res)=>{
    console.log('__dirname')
    res.render('index.ejs',{});

});

module.exports = router;