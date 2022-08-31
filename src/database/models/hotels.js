let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let HotelSchema = new Schema({
    hotelId: {
        unique: true,
        type: String
    },
    address: {
        country:String,
        city: String,
        postCode: String,
        fullAddress: String,
    },
    rating: {
        title: String,
        numStars: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    pricePerNight: Number,
    name: String,
    location:  {
        latitude: Number,
        longitude: Number
    },
    guestReviews:{
        avgRating: Number,
        totalNumRatings: Number
    }
}, {versionKey: false, timestamps: true})

const Users = mongoose.model('Hotels', HotelSchema);
module.exports = Users;