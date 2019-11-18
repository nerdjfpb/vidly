//require express and router to pass the router to index.js file
const { Rental, validate } = require('../model/rental');
const { Movie } = require('../model/movie');
const { Customer } = require('../model/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

//show all rental
router.get('/', async(req,res) => {
	//sending all data to response
	const rental = await Rental.find().sort('-dateOut');
	res.send(rental);
});

//get the data about a single rental
router.get('/:id',async(req,res) => {
	//search using id In mongodb with mongoose
	const rental = await Rental.findById(req.params.id);
	//checking if rental not found then 404 request & if found then send the response
	if(!rental) return res.status(404).send(`Sorry! We don't have anything like this`)
	res.send(rental);
});

//insert a new data in rentals
router.post('/', async(req,res) => {
	//validate using Joi, with factoring function
    const { error } = validate(req.body);

    if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
        return res.status(400).send('Invalid Customer');
    if(!mongoose.Types.ObjectId.isValid(req.body.movieId))
        return res.status(400).send('Invalid Movie');

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid Genre');
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid Movie');

    if(movie.numberInStock ===0) return res.status(400).send('Movie not in stock.');

	//if have any error then return bad request with error else just add the new one
	if(error){
		return res.status(400).send(error.details[0].message);
	}else{
		let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        
        try{
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies', { _id: movie._id}, {
                    $inc: { numberInStock: -1 }
                })
                .run();
            res.send(rental);
        }
        catch(ex){
            res.status(500).send('Something failed');
        }
	}
});


router.delete('/:id',async(req,res) =>{

	//find an delete the data using moongoose & mongodb
	const rental = await Rental.findByIdAndRemove(req.params.id);

	//checking if Movie not found then 404 request & if found then send the response
	if(!rental) return res.status(404).send(`Sorry! We don't have anything like this`);

	//finally response send with deleted data
	res.send(rental);

});



//export it for accessing
module.exports = router;