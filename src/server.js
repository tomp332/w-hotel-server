const express = require('express')
const app = express()
const dotenv = require('dotenv')
const {connectToDB} = require("./database/db");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
dotenv.config()

// Routes
const apiRouter = require("./routes/api/api")
app.use('/api', apiRouter)

connectToDB().then(() => {
    console.log("[+] Successfully connected to data base")
    app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, null, () => {
        console.log(`[+] Started server ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
    })
}).catch((err) => {
    console.log("[-] Failed to connect to data base", err)
    throw new Error(`[-] Failed to connect to database, ${err}`)
})
