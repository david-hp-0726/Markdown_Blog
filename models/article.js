const mongoose = require('mongoose');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM('').window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sanitizedHtml: {
        type: String,
        required: true,
    }
});

articleSchema.pre('validate', function(next) {
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown, {
            mangle: false,
            headerIds: false,
            headerPrefix: false,
        }));
    }

    next();
});

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
module.exports = Article;