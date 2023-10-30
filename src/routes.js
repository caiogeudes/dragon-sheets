const express = require('express');
const validateNewUser = require('./middlewares/validateUser');
const validateLogin = require('./middlewares/validateLogin');
const { getSignUpPage, getUserPage, createUser } = require('./controllers/user');
const { getLoginPage, login } = require('./controllers/login');
const validateToken = require('./middlewares/validateToken');
const rota = express();

rota.get('/sign-up', getSignUpPage)
rota.post('/sign-up', validateNewUser, createUser);
rota.get('/login', getLoginPage);
rota.post('/login', validateLogin, login);

rota.use(validateToken);

rota.get('/user', getUserPage);
module.exports = rota