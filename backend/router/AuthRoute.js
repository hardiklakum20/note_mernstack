const express = require('express');
const { RegisterMiddleware, LoginMiddleware, ChangePasswordMiddleware, ensureAuthantication, ForgotPasswordMiddleware, ResetPasswordMiddleware } = require('../middleware/AuthMiddleware');
const { RegisterController, LoginController, ChangePasswordController, ForgotPasswordController, ResetPasswordController, ProfileController } = require('../controller/AuthController');

const router = express.Router();

router.post('/register', RegisterMiddleware, RegisterController);
router.post('/login', LoginMiddleware, LoginController);
router.post('/change-password', ensureAuthantication, ChangePasswordMiddleware, ChangePasswordController);
router.post('/forgot-password', ForgotPasswordMiddleware, ForgotPasswordController);
router.post('/reset-password/:token', ResetPasswordMiddleware, ResetPasswordController);

module.exports = router;