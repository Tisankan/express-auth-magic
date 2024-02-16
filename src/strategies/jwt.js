// src/strategies/jwt.js

const jwt = require('jsonwebtoken');
const express = require('express');

const jwtStrategy = (jwtSecret) => {
    const router = express.Router();

    router.use((req, res, next) => {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    });

    return router;
};

module.exports = jwtStrategy;
