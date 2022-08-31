let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let ReservationSchema = new Schema({
    reservationId: {
        type: String,
        unique: true,
        immutable: true
    },
    hotels:{
        type: Array
    }

}, {versionKey: false, timestamps: true})

const Reservations = mongoose.model('Reservations', ReservationSchema);
module.exports = Reservations;