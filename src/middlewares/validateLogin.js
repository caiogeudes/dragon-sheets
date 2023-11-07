const schema = require('../schemas/loginSchema');
const knex = require('../database');
const bcrypt = require('bcrypt');
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const validateLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const htmlFile = await fs.readFile('./src/public/error-login.html', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err.message);
        } else {
            return data
        }
    });
    const root = parse(htmlFile);
    const errorMessage = root.querySelector('#errorMessage');
    try {
        await schema.validateAsync({ email, password });
        const userFound = await knex('users').where('email', email);
        if (userFound.length < 1) {
            errorMessage.set_content("'O e-mail ou a senha informados estão incorretos.'")
            const rootString = root.toString();
            return res.status(400).send(rootString)
        }
        const passwordCompare = await bcrypt.compare(password, userFound[0].password);
        if (!passwordCompare) {
            errorMessage.set_content("'O e-mail ou a senha informados estão incorretos.'")
            const rootString = root.toString();
            return res.status(400).send(rootString)
        } else {
            next()
        }
    } catch (error) {
        errorMessage.set_content(`${error.message}`)
        const rootString = root.toString();
        return res.status(400).send(rootString)
    }
}

module.exports = validateLogin