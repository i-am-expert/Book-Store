const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book')

// All Authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query 
        });
    } catch {
        res.redirect('/')
    }
});

// New author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

// The above route is just to display
// Route to actually create new author

// Create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        let locals = {
            author: author,
            errorMessage: 'Error creating author'
        }
        res.render('authors/new', locals);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6)
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch {
        res.redirect('/authors');
    }

});

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if(author == null) {
            // we failed at finding the author
            res.redirect('/')
        } else {
            let locals = {
                author: author,
                errorMessage: 'Error updating author'
            }
            res.render('authors/edit', locals);
        }
    }
});

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);
        await author.remove()
        res.redirect('/authors')
    } catch {
        if(author == null) {
            // we failed at finding the author
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
});

module.exports = router