const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const authorController = require('../controllers/author');



router.get('/author/all', authorController.getAllAuthors);
router.get('/author/search/:field/:filter', authorController.getAuthor);

//upload.none() enables newBook function to read form data.
//router.post('/book/:name', bookController.newComment);
router.post('/author/new', upload.none(), authorController.newAuthor);

router.put('/author/edit/:id/:field/:replace', upload.none(), authorController.editAuthor);

//router.delete('/book/delete/all', bookController.deleteAllBooks)
router.delete('/author/delete/:filter', authorController.deleteAuthor);

module.exports = router;

// function requireLogin(req, res, next) {
//     if (req.session.loggedIn) {
//       next(); // allow the next route to run
//     } else {
//       // require the user to log in
//       res.redirect("/login"); // or render a form, etc.
//     }
//   }