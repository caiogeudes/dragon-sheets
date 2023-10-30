require('dotenv').config();
const express = require('express');
const rotas = require('./routes');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

app.use(rotas)

app.listen(process.env.PORT);