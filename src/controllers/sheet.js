const { parse } = require('node-html-parser');
const fs = require('fs').promises;
const knex = require('../database');

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
        const sheet = await knex('user_sheets').where('user_id', id);
        let index = 0;
        for (let i = 0; i < sheet.length; i++) {
            if (sheet[i].sheet_id === newSheet[0].id) {
                index = i + 1;
            }
        }
        return res.status(201).redirect(`/my-sheet/${index}`);
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

            substituirValoresNulos(sheet3det[0], " ");

            const root = parse(htmlFile);
            const characterName = root.querySelector('#characterName');
            const points = root.querySelector('#points');
            const characterClass = root.querySelector('#characterClass');
            const characterRace = root.querySelector('#characterRace');
            const strenghPoints = root.querySelector('#strenghPoints');
            const habilityPoints = root.querySelector('#habilityPoints');
            const vantages = root.querySelector('#vantages');
            const resistancePoints = root.querySelector('#resistancePoints');
            const armorPoints = root.querySelector('#armorPoints');
            const disavantages = root.querySelector('#disavantages');
            const firePowerPoints = root.querySelector('#firePowerPoints');
            const healthPoints = root.querySelector('#healthPoints');
            const manaPoints = root.querySelector('#manaPoints');
            const experiencePoints = root.querySelector('#experiencePoints');
            const damageType = root.querySelector('#damageType');
            const spellsKnown = root.querySelector('#spellsKnown');
            const inventory = root.querySelector('#inventory');
            const history = root.querySelector('#history');


            characterName.set_content(`${sheet3det[0].charactername}`);
            points.set_content(`${sheet3det[0].points}`);
            characterClass.set_content(`${sheet3det[0].characterclass}`);
            characterRace.set_content(`${sheet3det[0].characterrace}`);
            strenghPoints.set_content(`${sheet3det[0].strenghpoints}`);
            habilityPoints.set_content(`${sheet3det[0].habilitypoints}`);
            vantages.set_content(`${sheet3det[0].vantages}`);
            resistancePoints.set_content(`${sheet3det[0].resistancepoints}`);
            armorPoints.set_content(`${sheet3det[0].armorpoints}`);
            disavantages.set_content(`${sheet3det[0].disavantages}`);
            firePowerPoints.set_content(`${sheet3det[0].firepowerpoints}`);
            healthPoints.set_content(`${sheet3det[0].healthpoints}`);
            manaPoints.set_content(`${sheet3det[0].manapoints}`);
            experiencePoints.set_content(`${sheet3det[0].experiencepoints}`);
            damageType.set_content(`${sheet3det[0].damagetype}`);
            spellsKnown.set_content(`${sheet3det[0].spellsknown}`);
            inventory.set_content(`${sheet3det[0].inventory}`);
            history.set_content(`${sheet3det[0].history}`);

            const url = root.querySelector('a[href="/my-sheet/:sheetNumber/update"]');
            url.setAttribute('href', `/my-sheet/${sheetNumber}/update`);
            const url2 = root.querySelector('a[href="/my-sheet/:sheetNumber/delete"]');
            url2.setAttribute('href', `/my-sheet/${sheetNumber}/delete`);
            const rootString = root.toString();
            return res.status(200).send(rootString);
        } else if (sheetsFound[sheetNumber - 1].system === 'Terra Devastada') {
            const sheetTerraDevastada = await knex('terra_devastada').where('id', sheetsFound[sheetNumber - 1].sheet_id);

            const htmlFile = await fs.readFile('./src/public/my-sheet-terra-devastada.html', 'utf-8', (err, data) => {
                if (err) {
                    return console.log(err.message);
                } else {
                    return data
                }
            });

            substituirValoresNulos(sheetTerraDevastada[0], "not null");

            const root = parse(htmlFile);
            const characterName = root.querySelector('#characterName');
            const horrorPoints = root.querySelector('#horrorPoints');
            const characterAppearance = root.querySelector('#characterAppearance');
            const characterConcept = root.querySelector('#characterConcept');
            const characteristics = root.querySelector('#characteristics');
            const conditions = root.querySelector('#conditions');
            const convictionPoints = root.querySelector('#convictionPoints');
            const trumps = root.querySelector('#trumps');
            const inventory = root.querySelector('#inventory');

            characterName.set_content(`${sheetTerraDevastada[0].charactername}`);
            horrorPoints.set_content(`${sheetTerraDevastada[0].horrorpoints}`);
            characterAppearance.set_content(`${sheetTerraDevastada[0].characterappearance}`);
            characterConcept.set_content(`${sheetTerraDevastada[0].characterconcept}`);
            characteristics.set_content(`${sheetTerraDevastada[0].characteristics}`);
            conditions.set_content(`${sheetTerraDevastada[0].conditions}`);
            convictionPoints.set_content(`${sheetTerraDevastada[0].convictionpoints}`);
            trumps.set_content(`${sheetTerraDevastada[0].trumps}`);
            inventory.set_content(`${sheetTerraDevastada[0].inventory}`);

            const url = root.querySelector('a[href="/my-sheet/:sheetNumber/update"]');
            url.setAttribute('href', `/my-sheet/${sheetNumber}/update`);
            const url2 = root.querySelector('a[href="/my-sheet/:sheetNumber/delete"]');
            url2.setAttribute('href', `/my-sheet/${sheetNumber}/delete`);
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
    const { id } = req.user;
    try {
        const sheetsFound = await knex('user_sheets').where('user_id', id);
        if (sheetsFound[sheetNumber - 1].system === '3D&T') {
            const sheet3det = await knex('threedetsheets').where('id', sheetsFound[sheetNumber - 1].sheet_id);
            const htmlFile = await fs.readFile('./src/public/my-sheet-3det-update.html', 'utf-8', (err, data) => {
                if (err) {
                    return console.log(err.message);
                } else {
                    return data
                }
            });

            substituirValoresNulos(sheet3det[0], " ");

            const root = parse(htmlFile);
            const url = root.querySelector('form[action="/my-sheet/:sheetNumber/update"]');
            const url2 = root.querySelector('a[href="/my-sheet/:sheetNumber"]');
            const characterName = root.querySelector('input[name="characterName"]');
            const points = root.querySelector('input[name="points"]');
            const characterClass = root.querySelector('input[name="characterClass"]');
            const characterRace = root.querySelector('input[name="characterRace"]');
            const strenghPoints = root.querySelector('input[name="strenghPoints"]');
            const habilityPoints = root.querySelector('input[name="habilityPoints"]');
            const resistancePoints = root.querySelector('input[name="resistancePoints"]');
            const armorPoints = root.querySelector('input[name="armorPoints"]');
            const firePowerPoints = root.querySelector('input[name="firePowerPoints"]');
            const vantages = root.querySelector('textarea[name="vantages"]');
            const disavantages = root.querySelector('textarea[name="disavantages"]');
            const healthPoints = root.querySelector('input[name="healthPoints"]');
            const manaPoints = root.querySelector('input[name="manaPoints"]');
            const experiencePoints = root.querySelector('input[name="experiencePoints"]');
            const damageType = root.querySelector('textarea[name="damageType"]');
            const spellsKnown = root.querySelector('textarea[name="spellsKnown"]');
            const inventory = root.querySelector('textarea[name="inventory"]');
            const history = root.querySelector('textarea[name="history"]');

            url.setAttribute('action', `/my-sheet/${sheetNumber}/update`);
            url2.setAttribute('href', `/my-sheet/${sheetNumber}`);
            characterName.setAttribute('placeholder', `${sheet3det[0].charactername}`);
            points.setAttribute('placeholder', `${sheet3det[0].points}`);
            characterClass.setAttribute('placeholder', `${sheet3det[0].characterclass}`);
            characterRace.setAttribute('placeholder', `${sheet3det[0].characterrace}`);
            strenghPoints.setAttribute('placeholder', `${sheet3det[0].strenghpoints}`);
            habilityPoints.setAttribute('placeholder', `${sheet3det[0].habilitypoints}`);
            resistancePoints.setAttribute('placeholder', `${sheet3det[0].resistancepoints}`);
            armorPoints.setAttribute('placeholder', `${sheet3det[0].armorpoints}`);
            firePowerPoints.setAttribute('placeholder', `${sheet3det[0].firepowerpoints}`);
            vantages.set_content(`${sheet3det[0].vantages}`);
            disavantages.set_content(`${sheet3det[0].disavantages}`);
            healthPoints.setAttribute('placeholder', `${sheet3det[0].healthpoints}`);
            manaPoints.setAttribute('placeholder', `${sheet3det[0].manapoints}`);
            experiencePoints.setAttribute('placeholder', `${sheet3det[0].experiencepoints}`);
            damageType.set_content(`${sheet3det[0].damagetype}`);
            spellsKnown.set_content(`${sheet3det[0].spellsknown}`);
            inventory.set_content(`${sheet3det[0].inventory}`);
            history.set_content(`${sheet3det[0].history}`);

            const rootString = root.toString();
            return res.status(200).send(rootString);
        } else if (sheetsFound[sheetNumber - 1].system === 'Terra Devastada') {
            const sheetTerraDevastada = await knex('terra_devastada').where('id', sheetsFound[sheetNumber - 1].sheet_id);
            const htmlFile = await fs.readFile('./src/public/my-sheet-terra-devastada-update.html', 'utf-8', (err, data) => {
                if (err) {
                    return console.log(err.message);
                } else {
                    return data
                }
            });

            substituirValoresNulos(sheetTerraDevastada[0], " ");

            const root = parse(htmlFile);
            const url = root.querySelector('form[action="/my-sheet/:sheetNumber/update"]');
            const url2 = root.querySelector('a[href="/my-sheet/:sheetNumber"]');
            const characterName = root.querySelector('input[name="characterName"]');
            const horrorPoints = root.querySelector('input[name="horrorPoints"]');
            const characterAppearance = root.querySelector('input[name="characterAppearance"]');
            const characterConcept = root.querySelector('textarea[name="characterConcept"]');
            const characteristics = root.querySelector('textarea[name="characteristics"]');
            const conditions = root.querySelector('textarea[name="conditions"]');
            const convictionPoints = root.querySelector('input[name="convictionPoints"]');
            const trumps = root.querySelector('textarea[name="trumps"]');
            const inventory = root.querySelector('textarea[name="inventory"]');

            url.setAttribute('action', `/my-sheet/${sheetNumber}/update`);
            url2.setAttribute('href', `/my-sheet/${sheetNumber}`);
            characterName.setAttribute('placeholder', `${sheetTerraDevastada[0].charactername}`);
            horrorPoints.setAttribute('placeholder', `${sheetTerraDevastada[0].horrorpoints}`);
            characterAppearance.setAttribute('placeholder', `${sheetTerraDevastada[0].characterappearance}`);
            characterConcept.set_content(`${sheetTerraDevastada[0].characterconcept}`);
            characteristics.set_content(`${sheetTerraDevastada[0].characteristics}`);
            conditions.set_content(`${sheetTerraDevastada[0].conditions}`);
            convictionPoints.setAttribute('placeholder', `${sheetTerraDevastada[0].convictionPoints}`);
            trumps.set_content(`${sheetTerraDevastada[0].trumps}`);
            inventory.set_content(`${sheetTerraDevastada[0].inventory}`);

            const rootString = root.toString();
            return res.status(200).send(rootString);
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const updateSheet = async (req, res) => {
    const { sheetNumber } = req.params;
    const { id } = req.user;

    try {
        const sheetsFound = await knex('user_sheets').where('user_id', id);
        if (sheetsFound[sheetNumber - 1].system === '3D&T') {
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
            return res.status(200).redirect(`/my-sheet/${sheetNumber}`);
        } else if (sheetsFound[sheetNumber - 1].system === 'Terra Devastada') {
            let {
                characterName,
                horrorPoints,
                characterAppearance,
                characterConcept,
                characteristics,
                conditions,
                convictionPoints,
                trumps,
                inventory
            } = req.body;

            if (characterName) {
                await knex('terra_devastada').update({ charactername: characterName }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (horrorPoints) {
                await knex('terra_devastada').update({ horrorpoints: horrorPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (characterAppearance) {
                await knex('terra_devastada').update({ characterappearance: characterAppearance }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (characterConcept) {
                await knex('terra_devastada').update({ characterconcept: characterConcept }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (characteristics) {
                await knex('terra_devastada').update({ characteristics }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (conditions) {
                await knex('terra_devastada').update({ conditions }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (convictionPoints) {
                await knex('terra_devastada').update({ convictionpoints: convictionPoints }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (trumps) {
                await knex('terra_devastada').update({ trumps }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            if (inventory) {
                await knex('terra_devastada').update({ inventory }).where('id', sheetsFound[sheetNumber - 1].sheet_id);
            }
            return res.status(200).redirect(`/my-sheet/${sheetNumber}`);
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const deleteSheet = async (req, res) => {
    const { id } = req.user
    const { sheetNumber } = req.params;
    try {
        const sheetsFound = await knex('user_sheets').where('user_id', id);
        if (sheetsFound[sheetNumber - 1].system === '3D&T') {
            await knex('threedetsheets').where('id', sheetsFound[sheetNumber - 1].sheet_id).delete();
            await knex('user_sheets').where('sheet_id', sheetsFound[sheetNumber - 1].sheet_id).delete();
        } else if (sheetsFound[sheetNumber - 1].system === 'Terra Devastada') {
            await knex('terra_devastada').where('id', sheetsFound[sheetNumber - 1].sheet_id).delete();
            await knex('user_sheets').where('sheet_id', sheetsFound[sheetNumber - 1].sheet_id).delete();
        };
        return res.status(200).redirect('/main')
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const getTerraDevastadaSheet = async (req, res) => {
    try {
        const htmlFile = await fs.readFile('./src/public/terra-devastada.html', 'utf-8', (err, data) => {
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

const createNewSheetTerraDevastada = async (req, res) => {
    const { id } = req.user;
    let {
        characterName,
        horrorPoints,
        characterAppearance,
        characterConcept,
        characteristics,
        conditions,
        convictionPoints,
        trumps,
        inventory
    } = req.body;

    if (horrorPoints === "") {
        horrorPoints = 0;
    } if (convictionPoints === "") {
        convictionPoints = 0;
    }
    try {
        const newSheet = await knex('terra_devastada').insert({
            user_id: id,
            charactername: characterName,
            horrorpoints: horrorPoints,
            characterappearance: characterAppearance,
            characterconcept: characterConcept,
            characteristics,
            conditions,
            convictionpoints: convictionPoints,
            trumps,
            inventory
        }).returning('*');

        await knex('user_sheets').insert({
            user_id: id,
            sheet_id: newSheet[0].id,
            system: 'Terra Devastada'
        });
        const sheet = await knex('user_sheets').where('user_id', id);
        let index = 0;
        for (let i = 0; i < sheet.length; i++) {
            if (sheet[i].sheet_id === newSheet[0].id) {
                index = i + 1;
            }
        }
        return res.status(201).redirect(`/my-sheet/${index}`);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}
module.exports = {
    getNewSheetPage,
    get3detPage,
    createNewSheet3DET,
    getMySheet,
    updateSheet,
    getUpdateSheet,
    deleteSheet,
    getTerraDevastadaSheet,
    createNewSheetTerraDevastada
}