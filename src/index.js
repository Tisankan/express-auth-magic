// src/index.js

const express = require('express');
const jwtStrategy = require('./strategies/jwt');
const sessionStrategy = require('./strategies/session');

const authMiddleware = (options) => {
    const router = express.Router();

    // Use strategies
    router.use('/jwt', jwtStrategy(options.jwtSecret));
    router.use('/session', sessionStrategy(options.sessionSecret));

    return router;
};

module.exports = authMiddleware;
