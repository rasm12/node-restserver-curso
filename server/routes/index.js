const express = require('express');
const app = express();

app.use(require('./userRoutes'));
app.use(require('./login'));

module.exports = app;