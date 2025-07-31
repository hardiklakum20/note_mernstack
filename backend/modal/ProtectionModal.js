const mongoose = require('mongoose');


const ProtectionSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    },  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    }
});

const ProtectionModal = mongoose.model('Protection', ProtectionSchema);

module.exports = ProtectionModal