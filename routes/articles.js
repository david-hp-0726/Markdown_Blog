const express = require('express');
const mongoose = require('mongoose');
const Article = require('./../models/article');
const articlesRouter = express.Router();

let databaseSize = 0;

articlesRouter.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article(), error: null })
});

articlesRouter.get('/delete_confirm/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article == null) {
        res.redirect('/');
    }
    res.render('articles/delete_confirm', { article: article });
})

articlesRouter.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article == null) {
        res.redirect('/');
    }
    res.render('articles/show', { article: article });
})

articlesRouter.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article, error: null });
})

articlesRouter.post('/', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })

    try {
        article = await article.save();
        let allArticles = await Article.find().sort({
            createdAt: 'asc'
        });
        if (allArticles.length > 5) {
            await Article.findByIdAndDelete(allArticles[0].id);
            res.redirect('/');
        }
        else {
            res.redirect(`/articles/${article.id}`);
        }
    } catch (error) {
        res.render('articles/new', { article: article, error: error.message });
    }
});

articlesRouter.put('/:id', async (req, res) => {
    let oldArticle = await Article.findById(req.params.id);
    oldArticle.title = req.body.title;
    oldArticle.description = req.body.description;
    oldArticle.markdown = req.body.markdown;

    try {
        await oldArticle.save();
        res.redirect('/');
    }
    catch (error) {
        res.render('articles/edit', { article: article, error: error.message });
    }
})


articlesRouter.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    databaseSize--;
    res.redirect('/');
});



module.exports = articlesRouter;