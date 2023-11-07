const knex = require('../database');
const jwt = require('jsonwebtoken');
const authorizationAxios = require('../utils/authAxios');
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const getLoginPage = async (req, res) => {
    try {
        const htmlFile = await fs.readFile('./src/public/index.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);
        const rootString = root.toString();
        return res.status(200).send(rootString);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
};

const login = async (req, res) => {
    const { email } = req.body;
    try {

        const userFound = await knex('users').where('email', email);
        const { password: _, ...user } = userFound[0];
        const token = jwt.sign({ id: userFound[0].id }, process.env.JWT_PASS, { expiresIn: '1d' });
        await authorizationAxios(token);

        return res.status(200).redirect('/main')
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}


module.exports = {
    login,
    getLoginPage
}
