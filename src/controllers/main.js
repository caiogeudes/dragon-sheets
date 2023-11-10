const knex = require('../database');
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const getMainPage = async (req, res) => {
    const { id } = req.user
    try {
        const htmlFile = await fs.readFile('./src/public/main.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);

        const sheetsFound = await knex('user_sheets').where('user_id', id);
        let count = 1;
        for (let sheet of sheetsFound) {
            if (count > 10) {
                count = 1
            }
            if (sheet.system === '3D&T') {
                const sheet3det = await knex('threedetsheets').where('id', sheet.sheet_id).returning('charactername, characterclass, characterrace');
                const characterName = root.querySelector(`#fichaName${count}`);
                characterName.set_content(`Nome: ${sheet3det[0].charactername}`);
                const characterRace = root.querySelector(`#fichaRace${count}`);
                characterRace.set_content(`Classe/Raça: ${sheet3det[0].characterclass} / ${sheet3det[0].characterrace}`);
                const sheetSystem = root.querySelector(`#fichaSistema${count}`);
                sheetSystem.set_content('Sistema: 3D&T');
                count++
            } else if (sheet.system === 'Terra Devastada') {
                const sheetTerraDevastada = await knex('terra_devastada').where('id', sheet.sheet_id).returning('charactername');
                const characterName = root.querySelector(`#fichaName${count}`);
                characterName.set_content(`Nome: ${sheetTerraDevastada[0].charactername}`);
                const characterRace = root.querySelector(`#fichaRace${count}`);
                characterRace.set_content(`Classe/Raça: Sobrevivente/Humano`);
                const sheetSystem = root.querySelector(`#fichaSistema${count}`);
                sheetSystem.set_content('Sistema: Terra Devastada');
                count++
            }
        }
        const modifiedHTML = root.toString();
        return res.status(200).send(modifiedHTML);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = {
    getMainPage
}