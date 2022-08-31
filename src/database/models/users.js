let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let UsersSchema = new Schema({
    userId: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    sessionKey: String,
    userReservations: [{
        hotelId: Number,
        name: String,
        checkIn: Date,
        checkOut: Date,
        numberOfGuests: Number
    }]
}, {versionKey: false, timestamps: true})

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;