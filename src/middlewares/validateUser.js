const schema = require('../schemas/userSchema');
const knex = require('../database')

const validateNewUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const validatedSchema = await schema.validateAsync({ name, email, password });
        const emailVerify = await knex('users').select('*').where('email', email);
        if (emailVerify.length > 0) {
            return res.status(400).json({ mensagem: 'E-mail informado já cadastrado.' })
        }
        next()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = validateNewUser;