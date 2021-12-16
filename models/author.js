const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({

    name: {type: String, required: true},
    name_lowercase: "",
    dob: {type: Date, required: true},
    dob_string: {type: String},
    id: {type: String, required: true}
});

const Author = mongoose.model('Author', AuthorSchema)

module.exports = Author;