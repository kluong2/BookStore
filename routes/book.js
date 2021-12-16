const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const bookController = require('../controllers/book');


router.get('/book/all', bookController.getAllBooks);
router.get('/book/search/:field/:filter', bookController.getBook);

//upload.none() enables newBook function to read form data.
router.post('/book/new', upload.none(), bookController.newBook);

router.put('/book/edit/:isbn/:field/:replace', upload.none(), bookController.editBook);

router.delete('/book/delete/:filter', bookController.deleteBook);
module.exports = router;


////Just some valid user checking. Might implement later.
// function requireLogin(req, res, next) {
//     if (req.session.loggedIn) {
//       next(); // allow the next route to run
//     } else {
//       // require the user to log in
//       res.redirect("/login"); // or render a form, etc.
//     }
//   }