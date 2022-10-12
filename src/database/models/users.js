let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let UsersSchema = new Schema({
    userId: {
        type: String,
        unique: true,
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
    }
}, { versionKey: false, timestamps: true })

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;