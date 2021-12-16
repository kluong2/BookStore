require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const bookroute = require('./routes/book');
const authorroute = require('./routes/author');
const helmet = require('helmet');
const app = express();

app.use(helmet());

app.use(express.json()); // parses incoming requests with JSON payloads
app.use('/', bookroute);
app.use('/', authorroute);

 //establish connection to database
 mongoose.connect(
    process.env.MONGODB_URI,
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
 

