const joi = require('joi');


const ProtectionMiddleware = (req, res, next) => {
    const schema = joi.object({
        password: joi.string()
            .min(4)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{4,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                'string.min': 'Password must be at least 4 characters long.'
            }),

        confirmPassword: joi.string()
            .valid(joi.ref('password'))
            .required()
            .messages({ 'any.only': 'Confirm password must match new password.' }),

        noteId: joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = ProtectionMiddleware