const knex = require('../database');
const jwt = require('jsonwebtoken');
const authorizationAxios = require('../utils/authAxios');

const login = async (req, res) => {
    const { email } = req.body;
    try {
        const userFound = await knex('users').where('email', email);
        const { password: _, ...user } = userFound[0];
        const token = jwt.sign({ id: userFound[0].id }, process.env.JWT_PASS, { expiresIn: '1d' });
        await authorizationAxios(token);
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = {
    login
}
