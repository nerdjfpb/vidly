//require express and router to pass the router to index.js file
const { Genre, validate } = require('../model/genre');
const express = require('express');
const router = express.Router();

//current static db
// const genres = [
// 	{id: 1, name: 'genres1'},
// 	{id: 2, name: 'genres2'},
// 	{id: 3, name: 'genres3'},
// ];

//show all genres
router.get('/', async(req,res) => {
	//sending all data to response
	const genres = await Genre.find().sort('name');
	res.send(genres);
});

//get the data about a single genre
router.get('/:id',async(req,res) => {
	//search using id In mongodb with mongoose
	const genre = await Genre.findById(req.params.id);
	//checking if genre not found then 404 request & if found then send the response
	if(!genre) return res.status(404).send(`Sorry! We don't have anything like this`)
	res.send(genre);
});

//insert a new data in genres
router.post('/', async(req,res) => {
	//validate using Joi, with factoring function
	const { error } = validate(req.body);
	//if have any error then return bad request with error else just add the new one
	if(error){
		return res.status(400).send(error.details[0].message);
	}else{
		let genre = new Genre({
			name : req.body.name
		});
		genre = await genre.save();
		res.send(genre);
	}
});

//update a existing data Using MongoDB
router.put('/:id',async(req,res)=>{
	//error checking
	const { error } = validate(req.body);
	if(error){
		return res.status(400).send(error.details[0].message);
	}
	//find Id and updated it by mongoose
	const genre = await Genre.findByIdAndUpdate(req.params.id, { name:req.body.name }, {
		new: true
	})
	// if genre is not available then error orelse new updated data send to user
	if(!genre) return res.status(404).send(`Sorry! We don't have anything like this`);
	else{
		res.send(genre);
	}

});

router.delete('/:id',async(req,res) =>{

	//find an delete the data using moongoose & mongodb
	const genre = await Genre.findByIdAndRemove(req.params.id);

	//checking if genre not found then 404 request & if found then send the response
	if(!genre) return res.status(404).send(`Sorry! We don't have anything like this`);

	//finally response send with deleted data
	res.send(genre);

});


//export it for accessing
module.exports = router;