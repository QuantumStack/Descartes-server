const express = require('express');

const router = express.Router();

const postRouter = require('./post');

app.post('/', postRouter);
