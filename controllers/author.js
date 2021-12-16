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




// Route is '/author/new'
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



//Route is '/author/search/:parameter/:filter'
const getAuthor = (req, res, next) => 
{
    let field = req.params.field;
    let filter = req.params.filter;
    let regex = {$regex: filter.toLowerCase(), $options: 'i'};//Regular expression for partial matches
    if(field == "name")
    {
        //Best partial match will be first in the returned array.
        //Other partial matches will be below.
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



//Route is '/author/edit/:field/:replace'
const editAuthor = (req, res, next) => 
{
    let isbn = req.params.isbn;
    let field = req.params.field;
    let replace = req.params.replace;
    if(field == "name")
    {
        //Search for author by exact ID so no other authors are affected.
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

//Route is '/delete/:filter'
const deleteAuthor = (req, res, next) => 
{
    let amount = req.params.amount;
    let field = req.params.field;
    let filter = req.params.filter;

        //Search by exact ID so no other authors are affected.
        Author.deleteOne({id: filter}, (err, data) => 
        {
            if(data.deletedCount == 0) 
            {
                return res.status(404).json({message: "404: Author does not exist."});
            }

            else if (err) return res.status(400).json(`400: Something went wrong. Please try again. ${err}`);

            else return res.status(200).json({message: "200: Author deleted!"});
        })
};

//export controller functions
module.exports = {
    getAllAuthors, 
    newAuthor,
    getAuthor,
    editAuthor,
    deleteAuthor
};
