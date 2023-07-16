const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const articlesRouter = require('./routes/articles');
const Article = require('./models/article');
const PORT = process.env.PORT || 4000;
const CONNECTION_URL = process.env.CONNECTION_URL;

// Settings & Middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// Routers
app.use('/articles', articlesRouter);

// Connect to database & Start server
mongoose.connect("mongodb+srv://xche653:muekrB4mEkAGate@cluster0.emslgxv.mongodb.net/?retryWrites=true&w=majority")
    .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
    .catch((error) => console.log(error.message));

// Routers
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    });
    
    res.render('articles/index', { articles: articles });
})

