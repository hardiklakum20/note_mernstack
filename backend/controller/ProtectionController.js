const { default: mongoose } = require("mongoose")
const NoteModal = require("../modal/NoteModal")
const ProtectionModal = require("../modal/ProtectionModal")
const bcrypt = require("bcrypt")


const ProtectionController = async (req, res) => {
    try {
        const { userId } = req.user
        const { password, confirmPassword, noteId } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password does not match" })
        }
        if (!userId || !noteId) {
            return res.status(400).json({ error: "User or Note not found" });
        }

        const existing = await ProtectionModal.findOne({ user: userId, noteId });
        if (existing) {
            return res.status(400).json({ error: "Password already exists for this note" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const protection = new ProtectionModal({ password: hashedPassword, user: userId, noteId });
        await protection.save();
        await NoteModal.findByIdAndUpdate(noteId, { protect: true });
        return res.status(201).json({ message: "Password protected successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const UnprotectController = async (req, res) => {
    try {
        const { unlockPassword, noteId } = req.body;
        const { userId } = req.user

        console.log('Checking for protection:', {
            userId,
            noteId
        });
        console.log('UnprotectController:', { userId, noteId });

        const protection = await ProtectionModal.findOne({ user: userId, noteId });

        console.log('Protection Found:', protection);

        if (!protection) {
            return res.status(400).json({ error: "This note is not protected" });
        }

        const isPasswordMatch = await bcrypt.compare(unlockPassword, protection.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const note = await NoteModal.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.status(200).json({
            message: "Unlocked successfully",
            note
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
        console.log(error);
    }
}

const DeleteProtectionController = async (req, res) => {
    try {
        const { id } = req.params;
        const protection = await ProtectionModal.findOneAndDelete({ noteId: id });
        if (!protection) {
            return res.status(404).json({ error: "Protection not found for this note." });
        }
        await NoteModal.findByIdAndUpdate(id, { protect: false });
        return res.status(200).json({ message: "Protection deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
        console.log(error);
    }
}

const UpdateProtectionController = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "New password and confirm password do not match" });
        }

        const protection = await ProtectionModal.findOne({ noteId: id });
        if (!protection) {
            return res.status(404).json({ error: "Protection not found for this note." });
        }

        const isPasswordMatch = await bcrypt.compare(password, protection.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        protection.password = hashedPassword;
        await protection.save();

        return res.status(200).json({ message: "Protection updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
        console.log(error);
    }
}

module.exports = { ProtectionController, UnprotectController, DeleteProtectionController, UpdateProtectionController }