const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    title: {type: String, required: true},
    title_lowercase: "",//Makes book easier to search for.
    year: {type: Number, required: true},
    year_string: {type: String},//Makes book easier to search for.
    id: {type: String},

    authors:[{
        type: mongoose.Schema.Types.ObjectId,//Reference author data from "authors" collection.
        ref: "Author"
    }],

    author: {type: String, required: true},
    isbn: {type: String, required: true, unique: true}


});

const Book = mongoose.model('Book', BookSchema)

module.exports = Book;