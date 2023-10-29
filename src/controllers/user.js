const knex = require('../database');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const encryptedPass = await bcrypt.hash(password, 10);
        const newUser = await knex('users').insert({ name, email, password: encryptedPass }).returning('*');
        const { password: _, ...user } = newUser[0];
        return res.status(201).json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

const getUser = async (req, res) => {
    const user = req.user
    return res.status(200).json({
        user
    })
}

module.exports = {
    createUser,
    getUser
}