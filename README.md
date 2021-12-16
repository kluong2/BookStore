# BookStore
Sample bookstore

This was made using Express.js, which is a framework for Node.js. Node.js offers a way to run JavaScript without using a web browser. JavaScript itself is a lot easier than most programming languages. I used an object modeling tool called "Mongoose" in order to work with MongoDB. I chose these tools because they are all relatively "simple" compared to the other options. Express.js is also considered a "standard" framework for Node.js, so it's more portable.

The authors have a one-to-many relationship with the books. The author of a book must exist in the database before the book itself can be entered. This is so people can't just enter in nonexistent author names when entering a book into the database. You can do all the basic CRUD operations. GET requests can result in partial matches and more than one result.
