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
            return res.status(200).json({ sheet3det });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}
module.exports = {
    getNewSheetPage,
    get3detPage,
    createNewSheet3DET,
    getMySheet
}