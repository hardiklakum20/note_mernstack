const joi = require('joi');
const Jwt = require('jsonwebtoken');

const RegisterMiddleware = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

const LoginMiddleware = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

const ensureAuthantication = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).send({ message: "Unauthorized" });
    try {
        const decode = Jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized, JWT Wrong or Expired " });
    }
}

const ChangePasswordMiddleware = (req, res, next) => {
    const schema = joi.object({
        oldPassword: joi.string().min(4).required(),
        newPassword: joi.string().min(4).required(),
        confirmPassword: joi.string().min(4).valid(joi.ref('newPassword')).required()
            .messages({ 'any.only': 'Confirm password must match new password' })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

const ForgotPasswordMiddleware = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

const ResetPasswordMiddleware = (req, res, next) => {
    const schema = joi.object({
        newPassword: joi.string().min(4).required(),
        confirmPassword: joi.string().min(4).valid(joi.ref('newPassword')).required()
            .messages({ 'any.only': 'Confirm password must match new password' })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = { RegisterMiddleware, LoginMiddleware, ChangePasswordMiddleware, ensureAuthantication, ForgotPasswordMiddleware, ResetPasswordMiddleware };