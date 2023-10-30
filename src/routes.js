const express = require('express');
const validateNewUser = require('./middlewares/validateUser');
const validateLogin = require('./middlewares/validateLogin');
const { createUser, getUser } = require('./controllers/user');
const { login } = require('./controllers/login');
const validateToken = require('./middlewares/validateToken');
const { getSignUp, getLogin } = require('./getPages');
const rota = express();

rota.get('/sign-up', getSignUp)
rota.post('/sign-up', validateNewUser, createUser);
rota.get('/login', getLogin);
rota.post('/login', validateLogin, login);

rota.use(validateToken);
rota.get('/user', getUser);

module.exports = rota