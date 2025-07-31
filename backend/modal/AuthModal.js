const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
}, { timestamps: true });

const AuthModal = mongoose.model('Auth', authSchema);

module.exports = AuthModal