const connectDB = require('./startup/db');
const express = require('express');
const app = express();

const collections = require('./routes/collections');
const cards = require('./routes/cards');

connectDB();

app.use(express.json());

app.use('/api/collections', collections);
app.use('/api/cards', cards);

