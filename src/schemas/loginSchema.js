const Joi = require('joi');

const schema = Joi.object({
    password: Joi.string().min(4).max(20).required().messages({
        'any.required': `O campo 'Senha' precisa ser informado.`,
        'string.empty': `O campo 'Senha' precisa ser informado.`,
        'string.min': `O campo 'Senha' precisa conter no minímo 4 caracteres.`,
        'string.max': `O campo 'Senha' só pode ter até 20 caracteres.`
    }),
    email: Joi.string().email().required().messages({
        'any.required': `O campo 'Email' precisa ser informado.`,
        'string.empty': `O campo 'Email' precisa ser informado.`,
        'string.email': `O campo 'Email' precisa ser um e-mail válido.`
    })
});

module.exports = schema 