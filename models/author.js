const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({

    name: {type: String, required: true},
    name_lowercase: "",//Easier to search for if everything is lowercase.
    dob: {type: Date, required: true},
    dob_string: {type: String},//Easier to find a partial match if the dob is a string
    id: {type: String, required: true, unique: true}//Authors can have the same name. This will be the primary key.
});

const Author = mongoose.model('Author', AuthorSchema)

module.exports = Author;