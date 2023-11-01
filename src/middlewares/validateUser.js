const schema = require('../schemas/userSchema');
const knex = require('../database')
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const validateNewUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    const htmlFile = await fs.readFile('./src/public/error-sign-up.html', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err.message);
        } else {
            return data
        }
    });
    const root = parse(htmlFile);
    const errorMessage = root.querySelector('#errorMessage');
    try {
        await schema.validateAsync({ name, email, password });
        const emailVerify = await knex('users').select('*').where('email', email);
        if (emailVerify.length > 0) {
            errorMessage.set_content("E-mail informado já cadastrado.")
            const rootString = root.toString();
            return res.status(400).send(rootString)
        }
        next()
    } catch (error) {
        errorMessage.set_content(`${error.message}`);
        const rootString = root.toString();
        return res.status(400).send(rootString);
    }
}

module.exports = validateNewUser;