//required library list
const express = require('express');
const app = express();
const Joi = require('joi');

//routes required file
const genres = require('./routes/genres');

// for parsing application/json
app.use(express.json());


//routes use
app.use('/api/genres',genres);


//Port through server port or else it will be 3000
const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`listening on port ${port}`));