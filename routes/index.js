const express = require('express');

// Import our modular routers for notesAPIRouter
const notesAPIRouter = require('./notesAPIRoutes.js');
const app = express();

app.use('/notes', notesAPIRouter);


module.exports = app;
