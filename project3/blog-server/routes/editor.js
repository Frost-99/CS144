let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const app = require('../app');
let path = require('path');
const jwt_key = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';


function authJWT(req, res, next) {
    try {
        let token = req.cookies.jwt;
        let payload = jwt.verify(token, jwt_key);
        next();
    } catch (err) {
        res.redirect('/login?redirect=/editor/');
        console.log(err.message);
    }

}

// try {
//     // router.use(express.static(path.join(path.basename(__dirname), 'public')));
//     console.log(path.join(__dirname + '/../', 'public'));
//     router.use(express.static(path.join(__dirname + '/../', 'public')));
//     // res.send(express.static(path.join(path.basename(__dirname), 'public')));

// }  finally {

// }

module.exports = authJWT;