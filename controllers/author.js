const Author = require('../models/author');
//const Book = require('../models/book');


//GET information of all authors.
const getAllAuthors = (req, res, next) => 
{
    Author.find({}, (err, data) =>
    {
        if(err)
        {
            return res.status(404).json({message: "404: Authors do not exist!"});
        }
        else if(data.length == 0)
        {
            return res.status(204).json({message: "204: No authors to show!"});
        }
        else
        {
        return res.status(200).json(data);
        }
    })
};




// newAuthor function for post book route
const newAuthor = (req, res, next) => 
{

    Author.findOne({id: req.body.id}, (err, data) =>
    {
        if(!data)
        {
            const date = req.body.dob;
            const newAuthor = new Author({
                name: req.body.name,
                name_lowercase: req.body.name.toLowerCase(),
                dob: req.body.dob,
                dob_string: date.toString(),
                id: req.body.id

            })

            newAuthor.save((err, data) =>
            {

                if(err)
                { 
                    return res.status(400).json({message: "400: Required fields not entered!"});
                }
                else
                {
                    return res.status(200).json(data);
                }

            })

        }
        else
        {
            if(err) return res.status(400).json(`Something went wrong. ${err}`)
            return res.status(409).json({message: "409: This author already exists!"});
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
const getAuthor = (req, res, next) => 
{
    let field = req.params.field;
    let filter = req.params.filter;
    let regex = {$regex: filter.toLowerCase(), $options: 'i'};
    if(field == "name")
    {
        Author.find({name_lowercase: regex}, (err, data) => 
        {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message:"204: No authors to show!"});
            }
            else 
            {
                return res.status(200).json(data);
            }
        })
    }

    else if(field == "dob")
    {

        Author.find({dob_string: regex}, (err, data) => 
        {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message:"204: No authors to show!"});
            }
            else 
            {
                return res.status(200).json(data);
            }
        })

    }

    else if(field == "id")
    {
        Author.find({id: regex}, (err, data) => 
        {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message:"204: No authors to show!"});
            }
            else 
            {
                return res.status(200).json(data);
            }
        })

    }
    else
    {
        return res.status(404).json({message: "Invalid search parameter!"})
    }
};



//POST '/book/:name'
// const newComment = (req, res, next) => {
//     res.json({message: "POST 1 book comment"});
// };

const editAuthor = (req, res, next) => 
{
    let isbn = req.params.isbn;
    let field = req.params.field;
    let replace = req.params.replace;
    if(field == "name")
    {
        Author.findOneAndUpdate({id: id}, {name: replace, name_lowercase: replace.toLowerCase()}, (err, data) => {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message: "204: No authors to show!"})
            }
            else return res.status(200).json("Successful change!");
        })
    }
    else if(field == "dob")
    {
        Author.findOneAndUpdate({id: id}, {dob: replace}, (err, data) => {
            if(err || !data)
            {
                return res.status(500).json({message: "500: Internal server error!"});
            }
            else if(data.length == 0)
            {
                return res.status(204).json({message: "204: No authors to show!"})
            }
            else return res.status(200).json("Successful change!");
        })
    }
    else
    {
        return res.status(404).json({message: "404: Field does not exist!"})
    }
};

//DELETE '/book/:name'
const deleteAuthor = (req, res, next) => 
{
    let amount = req.params.amount;
    let field = req.params.field;
    let filter = req.params.filter;
    //if(amount == "single" && field == "id")
    //{
        Author.deleteOne({isbn: filter}, (err, data) => 
        {
            if(data.deletedCount == 0) 
            {
                return res.status(404).json({message: "404: Author does not exist."});
            }

            else if (err) return res.status(400).json(`400: Something went wrong. Please try again. ${err}`);

            else return res.status(200).json({message: "200: Author deleted!"});
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
    getAllAuthors, 
    newAuthor,
    //deleteAllBooks,
    getAuthor,
    editAuthor,
    //newComment,
    deleteAuthor
};
