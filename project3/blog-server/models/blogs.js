let client = require('../db');

async function getFive(username, startFrom) {
    let posts = client.db('BlogServer').collection('Posts');
    try {
        // Get 6 instead to help us determine whether we should have a next link later
        let result =  await posts.find({'username': username, 'postid': {'$gte': startFrom}}).sort({'postid': 1}).limit(6).toArray();
        return result;
    } catch (err) {
        console.log(err.message);
    }
}

async function getPost(username, postid) {
    try {
        // console.log(username, postid);
        let posts = client.db('BlogServer').collection('Posts');
        let doc = await posts.find({'username': username, 'postid': postid}).toArray();
        return doc;
    } catch (err) {
        console.log(err.message);
    }
}

async function getAll(username) {
    try {
        let posts = client.db('BlogServer').collection('Posts');
        let doc = await posts.find({'username': username}).toArray();
        return doc;
    } catch (err) {
        console.log(err.message);

    }
}

async function del(username, postid) {
    try {
        let posts = client.db('BlogServer').collection('Posts');
        let feedback = await posts.deleteOne({'username': username, 'postid': postid});
        // console.log(feedback);
        return feedback;
    } catch (err) {
        console.log(err.message);
    }
}

async function insert(username, postid, title, body) {
    try {
        let posts = client.db('BlogServer').collection('Posts');
        let dt = new Date();
        let newDoc = {'postid': postid, 'username': username, 'created': dt.getTime(), 'modified': dt.getTime(), 'title': title, 'body': body};
        let feedback = await posts.insertOne(newDoc);
        delete newDoc.username;
        delete newDoc.title;
        delete newDoc.body;
        delete newDoc._id
        feedback.inserted = newDoc;
        return feedback;
    } catch (err) {
        console.log(err.message);
    }
}

async function update(username, postid, title, body) {
    try {
        let posts = client.db('BlogServer').collection('Posts');
        let dt = new Date();
        let newTime = dt.getTime();
        let feedback = await posts.updateOne({'username': username, 'postid': postid}, {'$set': {'modified': newTime, 'title': title, 'body': body}});
        feedback.modifyTime = newTime;
        return feedback;
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    getFive,
    getPost,
    getAll,
    del,
    insert,
    update
};