# BookStore
Sample bookstore

This was made using Express.js, which is a framework for Node.js. Node.js offers a way to run JavaScript without using a web browser. JavaScript itself is a lot easier than most programming languages. I used an object modeling tool called "Mongoose" in order to work with MongoDB. I chose these tools because they are all relatively "simple" compared to the other options. Express.js is also considered a "standard" framework for Node.js, so it's more portable. Postman was used to test this backend API.

NOTE: You must have your own MongoDB database along with the correct URI to it in order to use this code. For security reasons, I .gitignore the .env file containing my MongoDB URI because it contains sensistive information like the login and password for my database.

The authors have a one-to-many relationship with the books. Specifically, the book schema has an array called "authors" within it that references author data. The author of a book must exist in the database before the book itself can be entered. This is so people can't just enter in nonexistent author names when entering a book into the database. You can do all the basic CRUD operations. GET requests can result in partial matches and more than one result.

Here are examples of what my data entries look like in MongoDB:
![image](https://user-images.githubusercontent.com/70615539/146448687-04d36e03-bc68-45bf-bf13-57d1c51a30e0.png)
![image](https://user-images.githubusercontent.com/70615539/146449016-fec7b27a-bffe-47b1-8a07-3ab68eea86aa.png)

