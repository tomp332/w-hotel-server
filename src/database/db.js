const mongoose = require("mongoose")
const uuid4 = require('uuid4');
const Users = require("./models/users")

const connectToDB = async () => {
    await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})

    // Create default admin user
    const adminOptions = {
        userId: uuid4(),
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        email: "admin@w-hotels.com",
        firstName: "Daniel",
        lastName: "Thomas",
        isAdmin: true
    }

    const adminUser = new Users({...adminOptions})
    try {
        adminUser.save(function (_, _) {
            console.log(`[+] Created default admin user with credentials: ${process.env.ADMIN_USERNAME} | ${process.env.ADMIN_PASSWORD}`)
        })
    } catch (err) {
    }
}

module.exports = {connectToDB}