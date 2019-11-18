//require express and router to pass the router to index.js file
const mongoose = require('mongoose');
const { Movie, validate } = require('../model/movie');
const { Genre } = require('../model/genre');
const express = require('express');
const router = express.Router();

//show all movie
router.get('/', async(req,res) => {
	//sending all data to response
	const movie = await Movie.find().sort('name');
	res.send(movie);
});

//get the data about a single movie
router.get('/:id',async(req,res) => {
	if(!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(404).send('Data not found in database');
	//search using id In mongodb with mongoose
	const movie = await Movie.findById(req.params.id);
	//checking if movie not found then 404 request & if found then send the response
	if(!movie) return res.status(404).send(`Sorry! We don't have anything like this`)
	res.send(movie);
});

//insert a new data in cmovie
router.post('/', async(req,res) => {
	//validate using Joi, with factoring function
	const { error } = validate(req.body);

	if(!mongoose.Types.ObjectId.isValid(req.body.genreId))
        return res.status(400).send('Invalid Genre');

    const genre = await Genre.findById(req.body.genreId);

	//if have any error then return bad request with error else just add the new one
	if(error){
		return res.status(400).send(error.details[0].message);
	}else{
		let movie = new Movie({
            title : req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
		});
		movie = await movie.save();
		res.send(movie);
	}
});

//update a existing data Using MongoDB
router.put('/:id',async(req,res)=>{
	//error checking
	const { error } = validate(req.body);

	if(!mongoose.Types.ObjectId.isValid(req.body.genreId))
        return res.status(400).send('Invalid Genre');

	const genre = await Genre.findById(req.body.genreId);


	if(error){
		return res.status(400).send(error.details[0].message);
	}
	//find Id and updated it by mongoose
	const movie = await Movie.findByIdAndUpdate(req.params.id, {
            title : req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
     }, {
		new: true
	})
	// if movie is not available then error orelse new updated data send to user
	if(!movie) return res.status(404).send(`Sorry! We don't have anything like this`);
	else{
		res.send(movie);
	}
});


router.delete('/:id',async(req,res) =>{

	//find an delete the data using moongoose & mongodb
	const movie = await Movie.findByIdAndRemove(req.params.id);

	//checking if Movie not found then 404 request & if found then send the response
	if(!movie) return res.status(404).send(`Sorry! We don't have anything like this`);

	//finally response send with deleted data
	res.send(movie);

});


//export it for accessing
module.exports = router;
