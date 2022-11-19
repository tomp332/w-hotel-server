let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let ReservationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    hotelName: {
        type: String,
        required: true
    },
    reservationId: {
        type: String,
        unique: true,
        required: true
    },city:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    checkIn: {
        required: true,
        type: Date
    },
    fullAddress:{
        type: String,
        required: true
    },
    checkOut: {
        required: true,
        type: Date
    },
    suiteRoomAmount: {
        required: false,
        type: Number
    },
    regularRoomAmount: {
        required: false,
        type: Number
    }
}, {versionKey: false, timestamps: true})

const Reservations = mongoose.model('Reservations', ReservationSchema);
module.exports = Reservations;