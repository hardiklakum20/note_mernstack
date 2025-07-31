const NoteModal = require("../modal/NoteModal");


const AddNoteController = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required." });
        }

        if (!req.user?.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const note = await new NoteModal({ title, description, user: req.user.userId });
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
        res.status(200).json({ notes: showNote });
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

        await NoteModal.findByIdAndUpdate(noteId, { title, description });
        res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        console.error("Error in UpdateNoteController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { AddNoteController, ShowNoteController, DeleteNoteController, UpdateNoteController };