let express = require('express');
let router = express.Router();
let blog = require('../models/blogs');
let user = require('../models/users');

router.get('/', async (req, res, next) => {
    try {
        let username = req.query.username;
        let postid = req.query.postid;
        if (username != null && postid != null) {
            postid = parseInt(postid);
            let post = await blog.getPost(username, postid);
            if (post.length == 0) {
                res.sendStatus(404);
            } else {
                res.status(200).json(post[0]);
            }
        }
        else if (username != null && postid == null) {
            let allPosts = await blog.getAll(username);
            res.status(200).json(allPosts);
        } else {
            throw new Error('Missing username or postid!');
        }
    } catch (e) {
        res.sendStatus(400);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        let username = req.query.username;
        let postid = req.query.postid;
        if (username != null && postid != null) {
            postid = parseInt(postid);
            let feedback = await blog.del(username, postid);
            if (feedback.deletedCount == 1) {
                // await user.updateMaxPostid(username, -1);
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } else {
            throw new Error('Bad parameters!');
        }
    } catch (err) {
        res.sendStatus(400);
    }
    
});

router.post('/', async (req, res, next) => {
    try {
        // console.log(req.body);
        let username = req.body.username;
        let postid = req.body.postid;
        let title = req.body.title;
        let body = req.body.body;
        console.log(username, postid, title, body);
        if (username == null || title == null || postid == null || body == null) {
            throw new Error('Bad parameter!');
        } else {
            postid = parseInt(postid);
            if (postid == 0) {
                let maxid = await user.getMaxPostid(username);
                if (maxid == null)
                    throw new Error('User do not exist!');
                else
                    maxid += 1;
                let feedback = await blog.insert(username, maxid, title, body);
                if (feedback.insertedId != null) {
                    await user.updateMaxPostid(username, 1);
                    res.status(201).json(feedback.inserted);
                } else {
                    throw new Error('Insert Error!');
                }
            }
            else if (postid > 0) {
                let feedback = await blog.update(username, postid, title, body);
                if (feedback.modifiedCount == 1) {
                    res.status(200).json({'modified': feedback.modifyTime});
                } else {
                    res.sendStatus(404);
                }
            }
            else {
                throw new Error('Bad postid!');
            }
        }
    } catch (err) {
        // console.log(err.message);
        res.sendStatus(400);
    }

});


module.exports = router;