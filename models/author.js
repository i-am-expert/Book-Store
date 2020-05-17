const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// 'remove' krne se pehle ye wala code run hoga
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if(err) {
            // if mongoose has an error in fetching book
            next(err)
        } else if(books.length > 0) {
            // if the author which we are trying to delete has some book whose author is this author
            next(new Error('This author has books still'))
        } else {
            // it's okay to delete author
            next()
        }
    })
});

module.exports = mongoose.model('Author', authorSchema);
// 'Author' is the name of the table and name of schema is 'authorSchema'