const express = require('express');
const mainRouter = require('./routers/index');
const app = express();

app.use('/api/v1', mainRouter);
