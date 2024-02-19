import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors);
app.use(express.json());

import mainRouter from './routers/index.js';

app.use('/api/v1', mainRouter);

app.listen(3000);
