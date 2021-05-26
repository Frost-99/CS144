let client = require('../db');
let bcrypt = require('bcryptjs');

async function authenticate(username, password) {
    let users = client.db('BlogServer').collection('Users');
    try {
        let matcedhUser = await users.findOne({'username': username});
        let result = bcrypt.compare(password, matcedhUser.password);
        return result;
    } catch (err) {
        console.log(err.message);
    }
}


module.exports = {authenticate};