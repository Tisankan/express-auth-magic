const express = require('express');

const sessionStrategy = (sessionSecret) => {
    const router = express.Router();

    router.use((req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        next();
    });

    return router;
};

module.exports = sessionStrategy;
