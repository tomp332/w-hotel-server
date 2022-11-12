const express = require('express')
const app = express()
const dotenv = require('dotenv')
const {connectToDB} = require("./database/db");
const cookieParser = require('cookie-parser');
const WebSocket = require('ws')
const https = require("https")
const fs = require("fs")
const passport = require("passport")
const uuid4 = require("uuid4")
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')
dotenv.config()


app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize({}));
app.use(passport.session({}));
app.use(express.static(__dirname + "/public"));

// Routes
const apiRouter = require("./controller/api")
const authRouter = require("./controller/auth/auth")
const publicPagesRouter = require('./controller/pages')

// Public pages router
app.use('/', publicPagesRouter)

//Authentication router
app.use('/auth', authRouter)

// main API routes
app.use('/api', apiRouter)


// Web socket server
const wss = new WebSocket.Server({port: process.env.WEBSOCKET_PORT});
const clients = new Map()

httpsServer = https.createServer({
        key: fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'privateKey.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'csr.cert')),
    },
    app);

connectToDB().then(() => {
    console.log("[+] Successfully connected to MongoDB Cloud")
    httpsServer.listen(process.env.SERVER_PORT, async () => {
        console.log(`[+] Started HTTPS server ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
        console.log(`[+] Started WEB SOCKET server ${process.env.SERVER_HOST}:${process.env.WEBSOCKET_PORT}`)
        wss.on('connection', (ws) => {
            const clientId = uuid4()
            clients.set(clientId, ws)
            console.log(`[+] New client connected to web socket, ID: ${clientId}`)
        })
    })
}).catch((err) => {
    console.log("[-] Failed to connect to data base", err)
    throw new Error(`[-] Failed to connect to database, ${err}`)
})