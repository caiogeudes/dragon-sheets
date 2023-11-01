const schema = require('../schemas/sheetSchema');
const knex = require('../database');
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const validateNewSheet = async (req, res, next) => {
    const { characterName } = req.body;
    const { id } = req.user;
    const htmlFile = await fs.readFile('./src/public/error-new-sheet.html', 'utf-8', (err, data) => {
        if (err) {
            return console.log(err.message);
        } else {
            return data
        }
    });
    const root = parse(htmlFile);
    const errorMessage = root.querySelector('#errorMessage');
    try {
        await schema.validateAsync({ characterName })
        const userFound = await knex('users').where('id', id);
        if (userFound.length < 1) {
            errorMessage.set_content('Usuário não encontrado.');
            const rootString = root.toString();
            return res.status(404).send(rootString);
        };
        const sheetsFound = await knex('user_sheets').where('user_id', id).count()
        if (sheetsFound[0].count === '10') {
            errorMessage.set_content('Você atingiu o limite máximo de fichas por conta. Por favor, apague uma para criar novas fichas.');
            const rootString = root.toString();
            return res.status(400).send(rootString);
        }
        next()
    } catch (error) {
        errorMessage.set_content(`${error.message}`);
        const rootString = root.toString();
        return res.status(400).send(rootString);
    }

}

module.exports = validateNewSheet
