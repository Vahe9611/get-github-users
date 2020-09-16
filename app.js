const express = require('express');
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const SequelizeObj = require(`${__dirname}/models`);

const indexRouter = require('./routes/index');

const app = express();

app.set('SDB', SequelizeObj);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const githubService = require('./service/githubService')(app);
const userService = require('./service/userService')(app);

require('./init')(githubService, userService)

app.use('/', indexRouter);

module.exports = app;
