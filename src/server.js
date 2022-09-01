const express = require('express')
const app = express()
const dotenv = require('dotenv')
const {connectToDB} = require("./database/db");
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');

app.use(cookieParser());
app.use(express.json());
dotenv.config()

// Routes
const apiRouter = require("./routes/api/api")
const uuid4 = require("uuid4");
app.use('/api', apiRouter)

// Web socket server
const wss = new WebSocket.Server({port: process.env.WEBSOCKET_PORT});
const clients = new Map();

connectToDB().then(() => {
    console.log("[+] Successfully connected to data base")
    app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, null, () => {
        console.log(`[+] Started HTTP server ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
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
