
const jwt = require('jsonwebtoken');
const knex = require('../database');

const validateToken = async (req, res, next) => {
    const token = localStorage.getItem('token');
    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_PASS);
        const id = verifiedToken.id
        const userFound = await knex('users').where('id', id);
        if (userFound.length < 1) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
        }
        const { password: _, ...user } = userFound[0];
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Usuário não autenticado, favor realizar login para acessar este conteúdo.' })
    }
}

module.exports = validateToken