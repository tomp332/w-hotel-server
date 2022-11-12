let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let UsersSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    sessionKey: {
        type: String
    },
    userReservations: {
        type: Array
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {versionKey: false, timestamps: true})
UsersSchema.pre('save', function (next) {
    // capitalize first name and last name
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase()
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase()
    next();
})


const Users = mongoose.model('Users', UsersSchema);
module.exports = Users