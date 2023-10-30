const knex = require('../database');
const bcrypt = require('bcrypt');
const { parse } = require('node-html-parser');
const fs = require('fs').promises;

const getSignUpPage = async (req, res) => {
    try {
        const htmlFile = await fs.readFile('./src/public/sign-up.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);
        const rootString = root.toString();
        return res.status(201).send(rootString);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
};

const getUserPage = async (req, res) => {
    const user = req.user
    try {
        const htmlFile = await fs.readFile('./src/public/user.html', 'utf-8', (err, data) => {
            if (err) {
                return console.log(err.message);
            } else {
                return data
            }
        });
        const root = parse(htmlFile);
        const userID = root.querySelector('#userID');
        userID.set_content(`${user.id}`)
        const userName = root.querySelector('#userName');
        userName.set_content(`${user.name}`)
        const userEmail = root.querySelector('#userEmail');
        userEmail.set_content(`${user.email}`)
        const modifiedHTML = root.toString();
        return res.send(modifiedHTML);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

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



module.exports = {
    createUser,
    getSignUpPage,
    getUserPage
}