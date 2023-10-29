const knex = require('../database');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email } = req.body;
    try {
        const userFound = await knex('users').where('email', email);
        const { password: _, ...user } = userFound[0];
        const token = jwt.sign({ id: userFound[0].id }, process.env.JWT_PASS, { expiresIn: '1d' });
        return res.status(200).json({
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = {
    login
}