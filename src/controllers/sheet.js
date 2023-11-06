const { parse } = require('node-html-parser');
const fs = require('fs').promises;
const knex = require('../database');

const getNewSheetPage = async (req, res) => {
    try {
        const htmlFile = await fs.readFile('./src/public/new-sheet.html', 'utf-8', (err, data) => {
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
}

const get3detPage = async (req, res) => {
    try {
        const htmlFile = await fs.readFile('./src/public/3det.html', 'utf-8', (err, data) => {
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
}

const createNewSheet3DET = async (req, res) => {
    const { id } = req.user;
    let {
        characterName,
        points,
        characterClass,
        characterRace,
        strenghPoints,
        habilityPoints,
        resistancePoints,
        armorPoints,
        firePowerPoints,
        vantages,
        disavantages,
        healthPoints,
        manaPoints,
        experiencePoints,
        damageType,
        spellsKnown,
        inventory,
        history
    } = req.body;

    if (points === "") {
        points = 0;
    } if (strenghPoints === "") {
        strenghPoints = 0;
    } if (habilityPoints === "") {
        habilityPoints = 0;
    } if (resistancePoints === "") {
        resistancePoints = 0;
    } if (armorPoints === "") {
        armorPoints = 0;
    } if (firePowerPoints === "") {
        firePowerPoints = 0;
    } if (healthPoints === "") {
        healthPoints = 0;
    } if (manaPoints === "") {
        manaPoints = 0;
    } if (experiencePoints === "") {
        experiencePoints = 0;
    }
    try {
        const newSheet = await knex('threedetsheets').insert({
            user_id: id,
            charactername: characterName,
            points,
            characterclass: characterClass,
            characterrace: characterRace,
            strenghpoints: strenghPoints,
            habilitypoints: habilityPoints,
            resistancepoints: resistancePoints,
            armorpoints: armorPoints,
            firepowerpoints: firePowerPoints,
            vantages,
            disavantages,
            healthpoints: healthPoints,
            manapoints: manaPoints,
            experiencepoints: experiencePoints,
            damagetype: damageType,
            spellsknown: spellsKnown,
            inventory,
            history
        }).returning('*');
        await knex('user_sheets').insert({
            user_id: id,
            sheet_id: newSheet[0].id,
            system: '3D&T'
        });
        return res.status(201).json({ sheet: newSheet })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

const getMySheet = async (req, res) => {
    let { sheetNumber } = req.params;
    const { id } = req.user;
    try {
        const sheetsFound = await knex('user_sheets').where('user_id', id);
        if (sheetsFound[sheetNumber - 1].system === '3D&T') {
            const sheet3det = await knex('threedetsheets').where('id', sheetsFound[sheetNumber - 1].sheet_id);

            const htmlFile = await fs.readFile('./src/public/my-sheet-3det.html', 'utf-8', (err, data) => {
                if (err) {
                    return console.log(err.message);
                } else {
                    return data
                }
            });

            function substituirValoresNulos(objeto, valorSubstituto) {
                for (let propriedade in objeto) {
                    if (objeto.hasOwnProperty(propriedade)) {
                        if (objeto[propriedade] === undefined) {
                            objeto[propriedade] = valorSubstituto;
                        } else if (objeto[propriedade] === null) {
                            objeto[propriedade] = valorSubstituto;
                        }
                    }
                    return objeto;
                }
            };
            substituirValoresNulos(sheet3det[0], " ");

            const root = parse(htmlFile);
            const characterName = root.querySelector('#characterName');
            characterName.set_content(`${sheet3det[0].charactername}`);
            const points = root.querySelector('#points');
            points.set_content(`${sheet3det[0].points}`);
            const characterClass = root.querySelector('#characterClass');
            characterClass.set_content(`${sheet3det[0].characterclass}`);
            const characterRace = root.querySelector('#characterRace');
            characterRace.set_content(`${sheet3det[0].characterrace}`);
            const strenghPoints = root.querySelector('#strenghPoints');
            strenghPoints.set_content(`${sheet3det[0].strenghpoints}`);
            const habilityPoints = root.querySelector('#habilityPoints');
            habilityPoints.set_content(`${sheet3det[0].habilitypoints}`);
            const vantages = root.querySelector('#vantages');
            vantages.set_content(`${sheet3det[0].vantages}`);
            const resistancePoints = root.querySelector('#resistancePoints');
            resistancePoints.set_content(`${sheet3det[0].resistancepoints}`);
            const armorPoints = root.querySelector('#armorPoints');
            armorPoints.set_content(`${sheet3det[0].armorpoints}`);
            const disavantages = root.querySelector('#disavantages');
            disavantages.set_content(`${sheet3det[0].disavantages}`);
            const firePowerPoints = root.querySelector('#firePowerPoints');
            firePowerPoints.set_content(`${sheet3det[0].firepowerpoints}`);
            const healthPoints = root.querySelector('#healthPoints');
            healthPoints.set_content(`${sheet3det[0].healthpoints}`);
            const manaPoints = root.querySelector('#manaPoints');
            manaPoints.set_content(`${sheet3det[0].manapoints}`);
            const experiencePoints = root.querySelector('#experiencePoints');
            experiencePoints.set_content(`${sheet3det[0].experiencepoints}`);
            const damageType = root.querySelector('#damageType');
            damageType.set_content(`${sheet3det[0].damagetype}`);
            const spellsKnown = root.querySelector('#spellsKnown');
            spellsKnown.set_content(`${sheet3det[0].spellsknown}`);
            const inventory = root.querySelector('#inventory');
            inventory.set_content(`${sheet3det[0].inventory}`);
            const history = root.querySelector('#history');
            history.set_content(`${sheet3det[0].history}`);

            const url = root.querySelector('a[href="/my-sheet/:sheetNumber/update"]');
            url.setAttribute('href', `/my-sheet/${sheetNumber}/update`);
            const rootString = root.toString();
            return res.status(200).send(rootString);
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const getUpdateSheet = async (req, res) => {
    const { sheetNumber } = req.params;
    try {
        const htmlFile = await fs.readFile('./src/public/my-sheet-3det-update.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);
        const url = root.querySelector('form[action="/my-sheet/:sheetNumber/update"]');
        url.setAttribute('action', `/my-sheet/${sheetNumber}/update`);
        const rootString = root.toString();
        return res.status(200).send(rootString);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}
const updateSheet = async (req, res) => {
    const { sheetNumber } = req.params;
    const { id } = req.user;
    let {
        characterName,
        points,
        characterClass,
        characterRace,
        strenghPoints,
        habilityPoints,
        resistancePoints,
        armorPoints,
        firePowerPoints,
        vantages,
        disavantages,
        healthPoints,
        manaPoints,
        experiencePoints,
        damageType,
        spellsKnown,
        inventory,
        history
    } = req.body;


    try {
        const sheetsFound = await knex('user_sheets').where('user_id', id);
        if (sheetsFound[sheetNumber - 1].system === '3D&T') {
            const htmlFile = await fs.readFile('./src/public/my-sheet-3det-update.html', 'utf-8', (err, data) => {
                if (err) {
                    return console.log(err.message);
                } else {
                    return data
                }
            });
            if (characterName) {
                await knex('threedetsheets').update({ charactername: characterName }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (points) {
                await knex('threedetsheets').update({ points }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (characterClass) {
                await knex('threedetsheets').update({ characterclass: characterClass }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (characterRace) {
                await knex('threedetsheets').update({ characterrace: characterRace }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (strenghPoints) {
                await knex('threedetsheets').update({ strenghpoints: strenghPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (habilityPoints) {
                await knex('threedetsheets').update({ habilitypoints: habilityPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (resistancePoints) {
                await knex('threedetsheets').update({ resistancepoints: resistancePoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (armorPoints) {
                await knex('threedetsheets').update({ armorpoints: armorPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (firePowerPoints) {
                await knex('threedetsheets').update({ firepowerpoints: firePowerPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (vantages) {
                await knex('threedetsheets').update({ vantages }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (disavantages) {
                await knex('threedetsheets').update({ disavantages }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (healthPoints) {
                await knex('threedetsheets').update({ healthpoints: healthPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (manaPoints) {
                await knex('threedetsheets').update({ manapoints: manaPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (experiencePoints) {
                await knex('threedetsheets').update({ experiencepoints: experiencePoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (damageType) {
                await knex('threedetsheets').update({ damagetype: damageType }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (spellsKnown) {
                await knex('threedetsheets').update({ spellsknown: spellsKnown }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (inventory) {
                await knex('threedetsheets').update({ inventory }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            if (history) {
                await knex('threedetsheets').update({ history }).where('id', sheetsFound[sheetNumber - 1].sheet_id)
            }
            const root = parse(htmlFile);
            return res.status(200).redirect(`/my-sheet/${sheetNumber}`);
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}
module.exports = {
    getNewSheetPage,
    get3detPage,
    createNewSheet3DET,
    getMySheet,
    updateSheet,
    getUpdateSheet
}