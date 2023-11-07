const express = require('express');
const validateNewUser = require('./middlewares/validateUser');
const validateLogin = require('./middlewares/validateLogin');
const validateToken = require('./middlewares/validateToken');
const validateNewSheet = require('./middlewares/validateNewSheet');
const { getSignUpPage, getUserPage, createUser } = require('./controllers/user');
const { getLoginPage, login } = require('./controllers/login');
const { getMainPage } = require('./controllers/main');
const { getNewSheetPage, createNewSheet3DET, get3detPage, getMySheet, updateSheet, getUpdateSheet, deleteSheet } = require('./controllers/sheet');
const rota = express();

rota.get('/sign-up', getSignUpPage)
rota.post('/sign-up', validateNewUser, createUser);
rota.get('/login', getLoginPage);
rota.post('/login', validateLogin, login);

rota.use(validateToken);

rota.get('/user', getUserPage);
rota.get('/main', getMainPage);
rota.get('/new-sheet', getNewSheetPage);
rota.get('/new-sheet-3det', get3detPage);
rota.post('/new-sheet-3det', validateNewSheet, createNewSheet3DET);
rota.get('/my-sheet/:sheetNumber', getMySheet);
rota.get('/my-sheet/:sheetNumber/update', getUpdateSheet);
rota.post('/my-sheet/:sheetNumber/update', updateSheet);
rota.get('/my-sheet/:sheetNumber/delete', deleteSheet);

module.exports = rota