//required library list
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const app = express();

//routes required file
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

//config for the json webtoken using config pkg
if (!config.get('jwtPrivateKey')) {
    // console.error('Fatal ERROR: jwtPrivateKey is not defined');
    // process.exit(1);
}

//connect to db
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...'));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
// for parsing application/json
app.use(express.json());

//routes use
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

//Port through server port or else it will be 3000
const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`listening on port ${port}`));
