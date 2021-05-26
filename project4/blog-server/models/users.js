let client = require('../db');

async function getMaxPostid(username) {
    try {
        let users = client.db('BlogServer').collection('Users');
        let result = await users.findOne({'username': username});
        return result.maxid;
    } catch (err) {
        console.log(err.message);
    }

}

async function updateMaxPostid(username, num) {
    try {
        let users = client.db('BlogServer').collection('Users');
        let feedback = await users.updateOne({'username': username}, {'$inc': {'maxid': num}});
        return feedback;
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    getMaxPostid,
    updateMaxPostid
}