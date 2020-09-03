const express = require('express');
const app = express();

app.use(require('./userRoutes'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagen'));

module.exports = app;