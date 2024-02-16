// test/session.test.js

const assert = require('assert');
const express = require('express');
const supertest = require('supertest');
const session = require('express-session');
const sessionStrategy = require('../src/strategies/session');

const app = express();

app.use(session({ secret: 'test_session_secret' }));
app.use('/protected', sessionStrategy('test_session_secret'));

app.get('/protected', (req, res) => {
    res.json({ message: 'Session Authentication Successful', user: req.session.user });
});

describe('Session Authentication Strategy', () => {
    it('should return 401 if no session user', async () => {
        const response = await supertest(app).get('/protected');
        assert.strictEqual(response.status, 401);
    });

    it('should return 200 and user information with a valid session', async () => {
        const agent = supertest.agent(app);
        await agent.get('/protected').expect(401); // Initial request without a session user

        await agent.post('/login').send({ username: 'test_user' }); // Simulate login and set session user

        const response = await agent.get('/protected'); // Request after login
        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(response.body, { message: 'Session Authentication Successful', user: { username: 'test_user' } });
    });
});
