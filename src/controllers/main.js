const knex = require('../database');
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const getMainPage = async (req, res) => {
    const user = req.user
    try {
        const htmlFile = await fs.readFile('./src/public/main.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);
        const modifiedHTML = root.toString();
        return res.status(200).send(modifiedHTML);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = {
    getMainPage
}