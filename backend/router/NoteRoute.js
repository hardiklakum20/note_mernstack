const express = require('express');
const { AddNoteController, ShowNoteController, DeleteNoteController, UpdateNoteController } = require('../controller/NoteController');
const { ensureAuthantication } = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/add-note', ensureAuthantication, AddNoteController);
router.get('/show-notes', ensureAuthantication, ShowNoteController);
router.delete('/delete-note/:id', DeleteNoteController);
router.put('/update-note/:id', UpdateNoteController);

module.exports = router;