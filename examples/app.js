// examples/app.js

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authMiddleware = require('../src/index');

const app = express();
const port = 3000;

// Set your secret keys
const jwtSecret = 'your_jwt_secret_key';
const sessionSecret = 'your_session_secret_key';

// Use middleware
app.use(cookieParser());
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use('/api', authMiddleware({ jwtSecret, sessionSecret }));

// Example protected routes
app.get('/api/jwt/protected', (req, res) => {
    res.json({ message: 'JWT Authentication Successful', user: req.user });
});

app.get('/api/session/protected', (req, res) => {
    res.json({ message: 'Session Authentication Successful', user: req.session.user });
});

// Example login route for session-based authentication
app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.user = { username };
    res.json({ message: 'Login successful', user: req.session.user });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
