const assert = require('assert');
const express = require('express');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const jwtStrategy = require('../src/strategies/jwt');

const app = express();
const jwtSecret = 'test_jwt_secret';

app.use('/protected', jwtStrategy(jwtSecret));

app.get('/protected', (req, res) => {
    res.json({ message: 'JWT Authentication Successful', user: req.user });
});

describe('JWT Authentication Strategy', () => {
    it('should return 401 if no token provided', async () => {
        const response = await supertest(app).get('/protected');
        assert.strictEqual(response.status, 401);
    });

    it('should return 401 if an invalid token provided', async () => {
        const invalidToken = jwt.sign({ sub: 'test_user' }, 'invalid_secret');
        const response = await supertest(app).get('/protected').set('Cookie', `jwt=${invalidToken}`);
        assert.strictEqual(response.status, 401);
    });

    it('should return 200 and user information with a valid token', async () => {
        const validToken = jwt.sign({ sub: 'test_user' }, jwtSecret);
        const response = await supertest(app).get('/protected').set('Cookie', `jwt=${validToken}`);
        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(response.body, { message: 'JWT Authentication Successful', user: { sub: 'test_user' } });
    });
});
