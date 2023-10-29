const schema = require('../schemas/loginSchema');
const knex = require('../database');
const bcrypt = require('bcrypt');

const validateLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const valitatedSchema = await schema.validateAsync({ email, password });
        const userFound = await knex('users').where('email', email);
        if (userFound.length < 1) {
            return res.status(400).json({ mensagem: 'O e-mail ou a senha informados estão incorretos.' })
        }
        const passwordCompare = await bcrypt.compare(password, userFound[0].password);
        if (!passwordCompare) {
            return res.status(400).json({ mensagem: 'O e-mail ou a senha informados estão incorretos.' })
        } else {
            next()
        }
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

module.exports = validateLogin