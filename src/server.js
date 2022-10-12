const express = require('express')
const app = express()
const dotenv = require('dotenv')
const { connectToDB } = require("./database/db");
const cookieParser = require('cookie-parser');
const WebSocket = require('ws')
const https = require("https")
const fs = require("fs")
const passport = require("passport")
const uuid4 = require("uuid4")
const session = require('express-session')

dotenv.config()
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



// Routes
const apiRouter = require("./routes/api/api")
const pagesRouter = require("./routes/pages/pages")
const authRouter = require("./routes/auth/auth")


// Main pages router
app.use('/', pagesRouter)

//Third party auth
app.use('/auth', authRouter)

// main API routes
app.use('/api', apiRouter)

// Web socket server
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT });
const clients = new Map()

httpsServer = https.createServer({
    key: fs.readFileSync('./certs/privateKey.key'),
    cert: fs.readFileSync('./certs/csr.cert'),
}, app);

connectToDB().then(() => {
    console.log("[+] Successfully connected to MongoDB Cloud")
    httpsServer.listen(process.env.SERVER_PORT, async() => {
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