const Book = require('../models/book');
const Author = require('../models/author');
const { json } = require('express');

//Return all books in the database. route is: /book/all
const getAllBooks = (req, res, next) => 
{
    Book.find({}, (err, data) =>{
        if(err)
        {
            return res.status(500).json({message: "500: Internal server error!"});//The .find() function should always return something, even if it's empty. If things go wrong, it's probably a server error.
        }
        else if(data.length == 0)
        {
            return res.status(204).json({message: "204: No books to show!"});//.find() will always return something, even if it's empty. Not really an error. Just no content.
        }
        else
        {
        return res.status(200).json(data);
        }
    })
};

// newBook function for post book route. route is: /book/new
const newBook = (req, res, next) => 
{

    //Check if the book already exists by searching the database for its isbn.
    Book.findOne({isbn: req.body.isbn}, (err, data) =>{
        if(!data)
        {
            //Search for the exact author name that was entered in with the book data to see if the author exists.
            //I am aware that two authors can have the same name, but it's extremely rare.
            //I believe it's OK for this exercise. Entering in author ID can be a lot more tedious.
            Author.findOne({name_lowercase: req.body.author.toLowerCase()}, (err, data) => 
            {
                if(err || !data)
                {
                    return res.status(500).json({message: "500: Internal server error!"});
                }
                else if(data.length == 0)
                {
                    return res.status(404).json({message: "404: Author does not exist!"})
                }
                else
                {
                    //Create new data entry
                    const newBook = new Book({
                
                        title: req.body.title,
                        title_lowercase: req.body.title.toLowerCase(),
                        year: req.body.year,
                        year_string: req.body.year.toString(),
                        id: data.id,////Info needed for association with author. Will not be outputted in GET requests later.
                        author: req.body.author,//Info needed for association with author. Will not be outputted in GET requests later.
                        isbn: req.body.isbn
                        
                    })
                    newBook.save((err, data) => {

                    if(err) 
                    {
                        return res.status(400).json({message: "400: Required fields not entered!"});
                    }
                    else
                    {
                        //This is for associating the author's information with the book.
                        //The author's name is entered, and the author's id has been put into the newBook's data.
                        //There is also an array in newBook's data that should be filled with a reference to the author's info.
                        //This is so changes to the author's data can affect all their books at once. It's better than
                        //making changes to both authors and books every time author gets updated.
                        Author.findOne({id: newBook.id}, (err, author) =>
                        {
                            
                            if(author)
                            {
                                newBook.authors.push(author);//Push's author's ObjectID into the "authors" array.
                                newBook.save();
                                //The author's exact name is required when entering a book. 
                                //Unfortunately, I do not believe Mongoose provides a way to un-require a field.
                                //This means I must keep the "author" field and I cannot delete it.
                                return res.status(201).json({message:"201: Book created!"});
                            }
                            else
                            {
                                return res.status(404).json({message:"404: Author does not exist!"});
                            }
                        });
                    }
                });
                }
            });
        }
        else
        {
            if(err) return res.status(400).json(`Something went wrong. ${err}`)
            return res.status(409).json({message: "409: This book already exists!"});
        }

        

    })

};

//Find books with specific filters and parameters. Route is: /book/search/:parameter/:filter
const getBook = (req, res) => 
{
    let field = req.params.field;
    let filter = req.params.filter;
    let regex = {$regex: filter.toLowerCase(), $options: 'i'};//Regular expression for partial matches. I believe this is also case-insensitive, but I will use the lowercase fields just in case.

    //Each parameter search has its own unique operations. If statements are required.
    if(field == "title")
    {
        //Using .find() with regex will bring up partial matches.
        //Best partial match will be first in the JSON array.
        Book.find({title_lowercase: regex}, "title year authors isbn", (err, data) => //Ouputs the title, year, authors, and isbn for a book. Remember that "authors" is an array.
        {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message:"204: No books to show!"});
            }
            else 
            {
            return res.status(200).json(data);
            }

        }).populate("authors", "name dob");//This populates the "author's" array with the appropriate author info from the author data.

    }
    else if(field == "year")
    {
        Book.find({year_string: regex}, "title year authors isbn", (err, data) => 
        {

            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message: "204: No books to show!"})
            }
            else
            {
            return res.status(200).json(data);
            }

        }).populate("authors", "name dob");

    }

    //This is a bit more complicated than the other searches. Because you are
    //searching by author's name and author's name can be updated from author info, 
    //you cannot rely on the author name already stored with the book's data.
    //You must search through author names in the author data, get their unique id,
    //and use it to find the appropriate books associated with them.
    else if(field == "author")
    {
        Author.find({name_lowercase: regex}, "id", (err, author) => 
        {
            if(err || !author)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(author.length == 0)
            {
                return res.status(204).json({message: "204: No authors to show!"})
            }
            else
            {

                Book.find({}, "title year authors isbn id", (err, book) => {
                    var object;
                    if(err || !book)
                    {
                        return res.status(500).json({message: "500: Internal server error!"});
                    }
                    else if(book.length == 0)
                    {
                        return res.status(204).json({message: "204: No books to show!"})
                    }
                    else 
                    {
                        var books = [];
                        //Find books associated with authors' ID and push them in
                        //"books" array. I am aware that this is not really efficient
                        //and that it's O(m * n), but .find() can be hard to work with
                        //because it's an async function. There were also time constraints.
                        for(var i = 0; i < author.length; i++)
                        {
                            for(var j = 0; j < book.length; j++)
                            {
                                
                                if(book[j].id == author[i].id)
                                {
                                    books.push(book[j]);
                                }
                            }
                        }
                        
                        for(var i = 0; i < books.length; i++)
                        {
                            //No need for the author's ID anymore. Delete it.
                            books[i].id = undefined;
                        }

                        return res.status(200).json(books);
                    }
        
                }).populate("authors", "name dob");
            }
        });

    }

    else if(field == "isbn")
    {
        Book.find({isbn: regex}, "title year authors isbn", (err, data) => {

            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message: "204: No books to show!"})
            }
            else return res.status(200).json(data);

        }).populate("authors", "name dob");

    }

    else if(field == "all")
    {
        //The "$or" is so every single field can be searched and taken into account
        //for partial matches.
        Book.find({$or:[{title_lowercase: regex}, {year: regex}, 
            {author_lowercase: regex}]}, "title year authors isbn", (err, data) => 
            {
                if(err || !data)
                {
                    return res.status(500).json({message: "500: Internal server error!"});
                }
                else if(data.length == 0)
                {
                    return res.status(204).json({message: "204: No books to show!"})
                }
                else return res.status(200).json(data);

        }).populate("authors", "name dob");

    }
    else
    {
        return res.status(404).json({message: "404: Invalid search parameters!"})
    }
};

//Update books. Route is /book/edit/:isbn/:field/:replace
const editBook = (req, res, next) => 
{
    //Beter to search by isbn. Books can have the same name and year.
    //Wouldn't want to update the wrong book.
    let isbn = req.params.isbn;
    let field = req.params.field;
    let replace = req.params.replace;
    if(field == "title")
    {
        Book.findOneAndUpdate({isbn: isbn}, {title: replace, title_lowercase: replace.toLowerCase()}, (err, data) => {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message: "204: No books to show!"})
            }
            else return res.status(200).json("Successful change!");
        })
    }
    else if(field == "year")
    {
        Book.findOneAndUpdate({isbn: isbn}, {year: replace, year_string: replace.toString()}, (err, data) => {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message: "204: No books to show!"})
            }
            else return res.status(200).json("Successful change!");
        })
    }
    else
    {
        return res.status(404).json({message: "404: Field does not exist!"})
    }
    //Note that there is no way to edit the author because it's just useless data.
    //The actual author info is referenced from the author collection, which is in the books'
    //"authors" array, so you can just make changes to the author's info in the author
    //collection.
};

//Route is book/delete/:isbn
const deleteBook = (req, res, next) => 
{
    //Beter to search by isbn. Books can have the same name and year.
    //Wouldn't want to delete the wrong book.
    let filter = req.params.filter;
        Book.deleteOne({isbn: filter}, (err, data) => 
        {

            if(data.deletedCount == 0) 
            {
                return res.status(404).json({message: "404: Book does not exist."});
            }

            else if (err) return res.status(400).json(`400: Something went wrong. Please try again. ${err}`);

            else return res.status(200).json({message: "200: Book deleted!"});
        })  
};

//export controller functions
module.exports = {
    getAllBooks, 
    newBook,
    getBook,
    editBook,
    deleteBook
};
