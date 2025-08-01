const express = require('express');
const { ProtectionController, UnprotectController, DeleteProtectionController, UpdateProtectionController } = require('../controller/ProtectionController');
const { ensureAuthantication } = require('../middleware/AuthMiddleware');
const ProtectionMiddleware = require('../middleware/ProtectionMiddleware');

const router = express.Router();

router.post('/protection', ensureAuthantication,ProtectionMiddleware, ProtectionController);
router.post('/unprotection', ensureAuthantication, UnprotectController);
router.delete('/deleteprotection/:id', ensureAuthantication, DeleteProtectionController);
router.post('/updateprotection/:id', ensureAuthantication, UpdateProtectionController);

module.exports = router;