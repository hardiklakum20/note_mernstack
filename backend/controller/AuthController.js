const AuthModal = require("../modal/AuthModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const RegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await AuthModal.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hexPassword = await bcrypt.hash(password, 10);

        const user = await new AuthModal({ name, email, password: hexPassword });
        await user.save();

        res.status(201).json(
            {
                message: "User registered successfully",
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await AuthModal.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token, name: user.name, status: true });
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
}

const ChangePasswordController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        const user = await AuthModal.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await AuthModal.findByIdAndUpdate(userId, { password: hashedPassword });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const ForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await AuthModal.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        user.resetPasswordToken = token;
        await user.save();

        const link = `${process.env.FRONTEND_PORT}/reset-password/${token}`;

        const mailOptions = {
            from: 'hardiklakum80@gmail.com',
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${link}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Password reset link sent to your email",
            token,
            user,
        });


    } catch (error) {
        console.log(error);
        res.status(400).send(error || "Something went wrong");
    }
}

const ResetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await AuthModal.findOne({ resetPasswordToken: token });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).send(error || "Something went wrong")
    }
}


module.exports = { RegisterController, LoginController, ChangePasswordController, ForgotPasswordController, ResetPasswordController };