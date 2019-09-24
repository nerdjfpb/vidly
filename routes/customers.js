//require express and router to pass the router to index.js file
const { Customer, validate } = require('../model/customer');
const express = require('express');
const router = express.Router();

//show all customers
router.get('/', async(req,res) => {
	//sending all data to response
	const customers = await Customer.find().sort('name');
	res.send(customers);
});

//get the data about a single customer
router.get('/:id',async(req,res) => {
	//search using id In mongodb with mongoose
	const customer = await Customer.findById(req.params.id);
	//checking if customer not found then 404 request & if found then send the response
	if(!customer) return res.status(404).send(`Sorry! We don't have anything like this`)
	res.send(customer);
});

//insert a new data in customers
router.post('/', async(req,res) => {
	//validate using Joi, with factoring function
	const { error } = validate(req.body);
	//if have any error then return bad request with error else just add the new one
	if(error){
		return res.status(400).send(error.details[0].message);
	}else{
		let customer = new Customer({
            name : req.body.name,
            phone : req.body.phone,
            isGold : req.body.isGold 
		});
		customer = await customer.save();
		res.send(customer);
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
	const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold 
     }, {
		new: true
	})
	// if customer is not available then error orelse new updated data send to user
	if(!customer) return res.status(404).send(`Sorry! We don't have anything like this`);
	else{
		res.send(customer);
	}

});


router.delete('/:id',async(req,res) =>{

	//find an delete the data using moongoose & mongodb
	const customer = await Customer.findByIdAndRemove(req.params.id);

	//checking if customer not found then 404 request & if found then send the response
	if(!customer) return res.status(404).send(`Sorry! We don't have anything like this`);

	//finally response send with deleted data
	res.send(customer);

});


//export it for accessing
module.exports = router;