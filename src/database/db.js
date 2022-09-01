const mongoose = require("mongoose")

const connectToDB = async () => {
    await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
}

module.exports = {connectToDB}