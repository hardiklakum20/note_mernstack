const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    },
    protect: {  
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const NoteModal = mongoose.model('Note', noteSchema);

module.exports = NoteModal