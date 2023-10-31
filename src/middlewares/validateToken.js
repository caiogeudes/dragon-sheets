const jwt = require('jsonwebtoken');
const knex = require('../database');
let token;

const validateToken = async (req, res, next) => {
    if (req.headers.authorization) {
        count = 1
        verify = true
        token = req.headers.authorization.replace('Bearer ', '')
    }
    try {
        const verifiedToken = await jwt.verify(token, process.env.JWT_PASS);
        const id = verifiedToken.id
        const userFound = await knex('users').where('id', id);
        if (userFound.length < 1) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
        }
        const { password: _, ...user } = userFound[0];
        req.user = user;
        verify = false
        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Usuário não autenticado, favor realizar login para acessar este conteúdo.' })
    }

}

module.exports = validateToken