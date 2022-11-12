let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
const HotelSchema = new Schema({
    hotelName: {
        unique: true,
        type: String,
        required: true,
        dropDups: true
    },
    hotelId: {
        unique: true,
        type: String,
        required: true,
        dropDups: true
    },
    address: {
        required: true,
        type: Object,
        dropDups: true
    },
    rating: {
        required: true,
        type: Object
    },
    pricePerNight: Number,
    pricePerSuite: Number,
    location: {
        required: true,
        type: Object,
        dropDups: true
    },
    guestReviews: Object
}, {versionKey: false, timestamps: true})

const Hotels = mongoose.model('Hotels', HotelSchema);
module.exports = Hotels;