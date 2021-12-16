const Book = require('../models/book');
const Author = require('../models/author');
const { json } = require('express');
//GET '/book'
const getAllBooks = (req, res, next) => {
    Book.find({}, (err, data) =>{
        if(err)
        {
            return res.status(500).json({message: "500: Internal server error!"});
        }
        else if(data.length == 0)
        {
            return res.status(204).json({message: "204: No books to show!"});
        }
        else
        {
        return res.status(200).json(data);
        }
    })
};

// newBook function for post book route
const newBook = (req, res, next) => {

    Book.findOne({isbn: req.body.isbn}, (err, data) =>{
        if(!data)
        {
            //var author_id = "";
            Author.findOne({name_lowercase: req.body.author.toLowerCase()}, (err, data) => 
            {
                if(err || !data)
                {
                    return res.status(500).json({message: "500: Internal server error!"});
                }
                else if(data.length == 0)
                {
                    return res.status(204).json({message: "204: No authors to show!"})
                }
                else
                {
                    //author_id = data.id;
                    //console.log(author_id);
                    const newBook = new Book({
                
                        title: req.body.title,
                        title_lowercase: req.body.title.toLowerCase(),
                        year: req.body.year,
                        year_string: req.body.year.toString(),
                        id: data.id,
                        author: req.body.author,
                        //author_lowercase: req.body.author.toLowerCase(),
                        isbn: req.body.isbn
                        
                    })
                    newBook.save((err, data) => {

                    if(err) 
                    {
                        return res.status(400).json({message: "400: Required fields not entered!"});
                    }
                    else
                    {
                        // return res.json(data);
                        Author.findOne({id: newBook.id}, (err, author) =>
                        {
                            
                            if(author)
                            {
                                //author.books.push(newBook);
                                newBook.authors.push(author);
                                //author.save();
                                //newBook.author.required = false;
                                //newBook.author = undefined;
                                //newBook.author_lowercase = undefined;
                                newBook.save();
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
            
            //console.log("Hi");

            // const newBook = new Book({
                
            //     title: req.body.title,
            //     title_lowercase: req.body.title.toLowerCase(),
            //     year: req.body.year,
            //     year_string: req.body.year.toString(),
            //     id: req.body.id,
            //     author: req.body.author,
            //     author_lowercase: req.body.author.toLowerCase(),
            //     isbn: req.body.isbn

            // })

            

            // newBook.save((err, data) =>{

            //     if(err) return res.json({Error: err});
            //     return res.json(data);

            // })


        //     newBook.save().then((result) => {

        //         Author.findOne({id: newBook.id}, (err, author) =>{
                    
        //             if(author){
        //                 author.books.push(newBook);
        //                 author.save();
        //                 res.json({message: 'Book created!'});
        //             }
                    
        //     });
        // })

    //     newBook.save((err, data) => {

    //         //  if(err) 
    //         //  {
    //         //  return res.json({Error: err});
    //         //  }
    //         // return res.json(data);
    //         Author.findOne({id: newBook.id}, (err, author) =>{
                
    //             if(author){
    //                 //author.books.push(newBook);
    //                 newBook.authors.push(author);
    //                 //author.save();
    //                 newBook.save();
    //                 res.json({message: 'Book created!'});
    //             }
                
                
    //     });
    // });



        }
        else
        {
            if(err) return res.status(400).json(`Something went wrong. ${err}`)
            return res.status(409).json({message: "409: This book already exists!"});
        }

        

    })

};


//DELETE '/book'
// const deleteAllBooks = (req, res, next) => {
//     Book.deleteMany({}, err =>{
//         if(err){
//             return res.json({message: "Complete delete failed"});
//         }
//         return res.json({message: "Complete delete successful"});

//     })
// };



//GET '/book/:name'
const getBook = (req, res) => {
    let field = req.params.field;
    let filter = req.params.filter;
    let regex = {$regex: filter.toLowerCase(), $options: 'i'};
    if(field == "title")
    {
        Book.find({title_lowercase: regex}, "title year authors isbn", (err, data) => {
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

        }).populate("authors", "name dob");

    }
    else if(field == "year")
    {
        Book.find({year_string: regex}, "title year authors isbn", (err, data) => {

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
    // else if(field == "author")
    // {
    //     Book.find({author_lowercase: regex}, (err, data) => {

    //         if(err || !data){
    //             return res.json({message: "Author does not exist."})
    //         }

    //         else return res.json(data);

    //     });

    // }
    else if(field == "author")
    {
        Author.find({name_lowercase: regex}, "id", (err, author) => {
            
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
                        //const books = [];
                        var books = [];
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
                        
                        //console.log(books);
                        
                        for(var i = 0; i < books.length; i++)
                        {
                            books[i].id = undefined;
                        }
                           
                        //console.log(books);
                        return res.status(200).json(books);
                    }
        
                }).populate("authors", "name dob");

            //    Book.find({id: author[0].id}, (err, book) => {

            //     if(err || !book){
            //         return res.json({message: "Book doesn't exist."})
            //     }
    
            //     else return res.json(book);
    
            // }).populate("authors", "name dob");
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



//POST '/book/:name'
// const newComment = (req, res, next) => {
//     res.json({message: "POST 1 book comment"});
// };

const editBook = (req, res, next) => {
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
    // if(field == "author")
    // {
    //     Book.findOneAndUpdate({isbn: isbn}, {author: replace, author_lowercase: replace.toLowerCase()}, (err, data) => {
    //         if(err || !data){
    //             return res.json({message: "Book doesn't exist."})
    //         }

    //         else return res.json(data);
    //     })
    // }
};

//DELETE '/book/:name'
const deleteBook = (req, res, next) => {
    //let amount = req.params.amount;
    //let field = req.params.field;
    let filter = req.params.filter;
    //if(amount == "single" && field == "isbn")
    //{
        Book.deleteOne({isbn: filter}, (err, data) => {

            if(data.deletedCount == 0) 
            {
                return res.status(404).json({message: "404: Book does not exist."});
            }

            else if (err) return res.status(400).json(`400: Something went wrong. Please try again. ${err}`);

            else return res.status(200).json({message: "200: Book deleted!"});
        })
    
    //}

    // if(amount == "many")
    // {
    //     if(field == "title")
    //     {
    //         Book.deleteMany({title_lower_case: filter.toLowerCase()}, (err, data) => {

    //             if(data.deletedCount == 0) return res.json({message: "Book doesn't exist."});
    
    //             else if (err) return res.json(`Something went wrong. Please try again. ${err}`);
    
    //             else return res.json({message: "Book deleted."});
    //         })
    //     }
    //     if(field == "year")
    //     {
    //         Book.deleteMany({year: filter}, (err, data) => {

    //             if(data.deletedCount == 0) return res.json({message: "Book doesn't exist."});
    
    //             else if (err) return res.json(`Something went wrong. Please try again. ${err}`);
    
    //             else return res.json({message: "Book deleted."});
    //         })
    //     }
    //     if(field == "author")
    //     {
    //         Book.deleteMany({author_lowercase: filter.toLowerCase}, (err, data) => {

    //             if(data.deletedCount == 0) return res.json({message: "Book doesn't exist."});
    
    //             else if (err) return res.json(`Something went wrong. Please try again. ${err}`);
    
    //             else return res.json({message: "Book deleted."});
    //         })
    //     }
    // }




    
};

//export controller functions
module.exports = {
    getAllBooks, 
    newBook,
    //deleteAllBooks,
    getBook,
    editBook,
    //newComment,
    deleteBook
};
