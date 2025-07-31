const express = require('express');
const { ensureAuthantication } = require('../middleware/AuthMiddleware');
const { ProfileController, UploadProfileController, deleteProfileImage } = require('../controller/Profilecontroller');
const { upload } = require('../middleware/multer');

const router = express.Router();

router.get('/profile', ensureAuthantication, ProfileController);
router.post('/upload', ensureAuthantication, upload.single('image'), UploadProfileController);
// router.put('/update', upload.single('image'), createOrUpdateProfile);
router.delete('/delete', ensureAuthantication, deleteProfileImage);

module.exports = router;