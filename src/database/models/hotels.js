let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let HotelSchema = new Schema({
    address: {
        country:String,
        city: String,
        postCode: String,
        fullAddress: String,
    },
    rating: {
        title: String,
        startsRating: Number
    },
    price: Number,
    name: String,
    location:  {
        latitude: Number,
        longitude: Number
    },
    guestReviews:{
        avgRating: Number,
        total: Number
    },
    dateAdded: Date
}, {versionKey: false})

const Users = mongoose.model('Hotels', HotelSchema);
module.exports = Users;