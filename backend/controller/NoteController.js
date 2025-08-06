const NoteModal = require("../modal/NoteModal");
const { encrypt, decrypt, isEncryptedFormat } = require("../utils/cryptoUtil");


const AddNoteController = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required." });
        }

        if (!req.user?.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const encryptedDescription = encrypt(description);

        const note = await new NoteModal({ title, description: encryptedDescription, user: req.user.userId });
        await note.save();

        res.status(201).json({ message: "Note added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const ShowNoteController = async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const showNote = await NoteModal.find({ user: req.user.userId });

        const decryptedNotes = showNote.map(note => {
            const noteObj = note.toObject(); // clone full note document

            if (isEncryptedFormat(noteObj.description)) {
                try {
                    noteObj.description = decrypt(noteObj.description);
                } catch (err) {
                    console.error("Decryption failed for note:", note._id, err.message);
                    noteObj.description = "Unable to decrypt";
                }
            }

            return noteObj;
        });

        res.status(200).json({ notes: decryptedNotes });
    } catch (error) {
        console.error("Error in ShowNoteController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const DeleteNoteController = async (req, res) => {
    try {
        const noteId = req.params.id;
        await NoteModal.findByIdAndDelete(noteId);
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in DeleteNoteController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const UpdateNoteController = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, description } = req.body;

        if (!noteId) {
            return res.status(400).json({ error: "Note note found" });
        }
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required." });
        }
         const finalDescription = isEncryptedFormat(description)
            ? description
            : encrypt(description);

        await NoteModal.findByIdAndUpdate(noteId, { title, description: finalDescription });
        res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        console.error("Error in UpdateNoteController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { AddNoteController, ShowNoteController, DeleteNoteController, UpdateNoteController };