let express = require('express');
let router = express.Router();
const auth = require('../models/login');
const jwt = require('jsonwebtoken');
const jwt_key = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

function verify(req, res, next) {
    try {
        let username = req.query.username;
        if (username == null)
            username = req.body.username;
        // console.log(req.cookies);
        let token = req.cookies.jwt;
        let payload = jwt.verify(token, jwt_key);
        // console.log(payload, username);
        if  (payload.usr == username)
            next();
        else
            throw new Error('Authentication failed!');
    } catch (err) {
        console.log(err.message);
        res.sendStatus(401);
    }
}

router.get('/', (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;
    const redirect = req.query.redirect;
    res.status(200).render('login', {'username': username, 'password': password, 'redirect': redirect, 'fail': false});
});

router.post('/', async (req, res, next) => {
    // console.log(req.params);
    // console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const redirect = req.body.redirect;
    try {
        if (username == null || password == null) {
            // throw new Error('Both username and password are required!');
            res.sendStatus(401);
            // res.status(401).render('login', {'fail': true});
        } else {
            const verified = await auth.authenticate(username, password);
            if (verified) {
                let date = new Date();
                date.setHours(date.getHours() + 2);
                // console.log(date.toLocaleTimeString());
                const token = jwt.sign({'usr': username, 'exp': date.getTime()}, jwt_key, {'header': {'alg': 'HS256', 'typ': 'JWT'}});
                // console.log(token);
                res.cookie('jwt', token);
                if (redirect == null) {
                    res.sendStatus(200);
                    // res.status(200).send('Authentication success!');
                } else {
                    res.redirect(302, redirect);
                }
            } else {
                throw new Error('Mismatch of username and password!');
            }
        }
    } catch (e) {
        res.status(401).render('login', {'username': username, 'password': password, 'redirect': redirect, 'fail': true});
    }
});

module.exports = {
    router,
    verify
};