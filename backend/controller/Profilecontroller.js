const { cloudinary } = require("../middleware/multer");
const AuthModal = require("../modal/AuthModal");
const ProfileModal = require("../modal/ProfileModal");

const ProfileController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await AuthModal.findById(userId);
        const profile = await ProfileModal.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            user, profile: {
                image: profile?.image || null
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const UploadProfileController = async (req, res) => {
    try {
        const image = req.file?.path;

        const userId = req.user.userId;
        const user = await AuthModal.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const imageUpload = await ProfileModal.findOne({ userId });

        if (imageUpload) {
            imageUpload.image = image;
            await imageUpload.save();
            res.status(200).json({ message: "Profile image updated successfully" });
        } else {
            const newImageUpload = new ProfileModal({ userId, image });
            await newImageUpload.save();
            res.status(201).json({ message: "Profile image uploaded successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong" });
    }
}

const deleteProfileImage = async (req, res) => {
    try {
        const userId = req.user.userId;

        const profile = await ProfileModal.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Extract public_id from the image URL
        const imageUrl = profile.image;
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1]; // e.g., abc123.jpg
        const publicId = `profiles/${fileName.split('.')[0]}`; // e.g., profiles/abc123

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Delete profile record
        await ProfileModal.deleteOne({ userId });

        res.status(200).json({ message: "Profile image deleted successfully" });
    } catch (error) {
        console.error("Delete profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { ProfileController, UploadProfileController, deleteProfileImage };