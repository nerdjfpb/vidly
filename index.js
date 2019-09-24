//required library list
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const app = express();

//routes required file
const genres = require('./routes/genres');
const customers = require('./routes/customers');

//connect to db
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...'));

// for parsing application/json
app.use(express.json());

//routes use
app.use('/api/genres', genres);
app.use('/api/customers', customers);


//Port through server port or else it will be 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));