let express = require('express');
let router = express.Router();
let blog = require('../models/blogs');
let commonmark = require('commonmark');

function markdownToHtml(markdownString) {
    let reader = new commonmark.Parser();
    let writer = new commonmark.HtmlRenderer();
    let parsed = reader.parse(markdownString);
    return writer.render(parsed);
}

router.get('/:username', async (req, res, next) => {
    // console.log(req.baseUrl);
    // console.log(req.params);
    // console.log(req.query);
    let startFrom = req.query.start;
    if (startFrom == null) {
        startFrom = 0;
    } else {
        startFrom = parseInt(startFrom);
    }
    let docs = await blog.getFive(req.params.username, startFrom);
    if (docs.length == 0) {
        res.sendStatus(404);
        // res.status(404).send("Nothing found!");
    } else {
        let next = null;
        if (docs.length == 6) {
            next = true;
            docs.pop();
        } else {
            next = false;
        }
        for (let i = 0; i < docs.length; i++) {
            docs[i].htmlTitle = markdownToHtml(docs[i].title);
            docs[i].htmlBody = markdownToHtml(docs[i].body);
            // let createTime = new Date(docs[i].created);
            // let modifyTime = new Date(docs[i].modified);
            // docs[i].convertedCreateTime = createTime.toDateString();
            // docs[i].convertedModifyTime = modifyTime.toDateString();
        }
        res.render('blogs', {'title': 'Blogs', 'blogs': docs, 'username': req.params.username, 'startFrom': startFrom + docs.length + 1, 'next': next});
    }
});

router.get('/:username/:postid', async (req, res, next) => {
    // console.log(req.baseUrl);
    // console.log(req.params);
    // console.log(req.query);
    let postid = parseInt(req.params.postid);
    let docs = await blog.getPost(req.params.username, postid);
    if (docs.length == 0) {
        res.sendStatus(404);
        // res.status(404).send("Nothing found!");
    } else {
        for (let i = 0; i < docs.length; i++) {
            docs[i].htmlTitle = markdownToHtml(docs[i].title);
            docs[i].htmlBody = markdownToHtml(docs[i].body);
            // let createTime = new Date(docs[i].created);
            // let modifyTime = new Date(docs[i].modified);
            // docs[i].convertedCreateTime = createTime.toDateString();
            // docs[i].convertedModifyTime = modifyTime.toDateString();
        }
        res.render('blog', {'title': 'Blogs', 'blogs': docs});
    }
});

module.exports = router;