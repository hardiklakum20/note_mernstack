// models/ProfileModel.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Auth',
    },
    image: {
        type: String,
        required: true
    },
}, { timestamps: true });

const ProfileModal = mongoose.model('Profile', profileSchema);

module.exports = ProfileModal;
