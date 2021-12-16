const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    title: {type: String, required: true},
    title_lowercase: "",
    year: {type: Number, required: true},
    year_string: {type: String},
    id: {type: String},

    authors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
    }],

    author: {type: String, required: true},
    //author_lowercase: "",
    isbn: {type: String, required: true, unique: true}


});

const Book = mongoose.model('Book', BookSchema)

module.exports = Book;