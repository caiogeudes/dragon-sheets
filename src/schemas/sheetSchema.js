const Joi = require('joi');

const schema = Joi.object({
    characterName: Joi.string().required().messages({
        'any.required': `O campo 'Nome' precisa ser informado.`,
        'string.empty': `O campo 'Nome' precisa ser informado.`,
    })
});

module.exports = schema 