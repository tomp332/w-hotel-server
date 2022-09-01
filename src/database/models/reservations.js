let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let ReservationSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    reservationId: {
        type: String,
        unique: true,
        required: true
    },
    hotelId: {
        type: String,
        required: true
    },
    checkIn: {
        required: true,
        type: Date
    },
    checkOut: {
        required: true,
        type: Date
    }
}, {versionKey: false, timestamps: true})

const Reservations = mongoose.model('Reservations', ReservationSchema);
module.exports = Reservations;