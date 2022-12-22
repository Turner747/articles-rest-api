const express = require('express');
const router = express.Router();
const Article = require("../models/article");

////////////////////////////////// all articles //////////////////////////////////
router.route('/')

.get((req, res) => {
    const queryParams = getQueryParams(req.query);

    Article.find(queryParams, (err, articles) => {
        if (err) {
            res.send(err);
            return;
        }
        res.send(articles);
    });
})

.post((req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    article.save((err, article) => {
        if (err) {
            res.statusCode = 400;
            res.send(err);
            return;
        }
        res.statusCode = 201;
        res.send(article);
    });
})

.delete((req, res) => {
    Article.deleteMany({}, (err, articles) => {
        if (err) {
            res.statusCode = 400;
            res.send(err);
            return;
        }
        res.sendStatus(204);
    });
});
////////////////////////////////// all articles //////////////////////////////////

///////////////////////////// specific article title //////////////////////////////
router.route("/:title")

.get((req, res) => {
    const title = req.params.title;

    Article.findOne({title: title}, (err, article) => {
        if (err) {
            res.statusCode = 400;
            res.send(err)
            return
        }
        res.send(article);
    });
});
///////////////////////////// specific article title //////////////////////////////

////////////////////////////// specific article id ////////////////////////////////
router.route("/:id")

.put((req, res) => {
    if(validatePutRequest(req.body)) {
        res = generateErrorResponse(res,
                "You must provided both title and content in order to update an article");
        res.send();
        return;
    }

    const id = req.params.id;
    const update = {
        title: req.body.title,
        content: req.body.content
    };
    Article.findByIdAndUpdate(id, update, {overwrite: true},(err, article) => {
        if (err) {
            res.statusCode = 400;
            res.send(err);
            return;
        }
        res.statusCode = 204;
        res.send(article);
    });
})

.patch((req, res) => {
    const id = req.params.id;
    const updateFields = req.body;

    Article.findByIdAndUpdate(id, { $set: updateFields }, {},(err, article) => {
        if (err) {
            res.statusCode = 400;
            res.send(err);
            return;
        }
        res.statusCode = 204;
        res.send(article);
    });
})

.delete((req, res) => {
    const articleId = req.params.id;
    Article.findByIdAndDelete(articleId, (err, article) => {
        if (err) {
            res.statusCode = 400;
            res.send(err);
            return;
        }
        res.sendStatus(204);
    });
});
////////////////////////////// specific article id ////////////////////////////////

function getQueryParams(query) {
    const queryParams = {};
    if(query.id){
        queryParams._id = query.id;
    }
    if (query.title) {
        queryParams.title = query.title;
    }
    if (query.content) {
        queryParams.content = {"$regex": query.content, "$options": "i"};
    }
    return queryParams;
}

function getPatchParams(body) {
    const putParams = [];
    if (body.title) {
        putParams.push({'$set': {title: body.title}});
    }
    if (body.content) {
        putParams.push({'$set': {content: body.content}});
    }
    return putParams;
}

function validatePutRequest(body) {
    return !body.title || !body.content;
}

function generateErrorResponse(res, message){
    res.statusCode = 400;
    res.contentType("application/json");
    res.json({error: message})
    return res;
}

module.exports = router;