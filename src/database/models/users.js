let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let UsersSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        immutable: true
    },
    username: {
        type: String,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        immutable: true
    },
    sessionKey: {
        type: String
    },
    userReservations: {
        type: Array
    }
}, {versionKey: false, timestamps: true})

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;