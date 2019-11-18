//require express and router to pass the router to index.js file
const _ = require('lodash');
const bcrypt = require('bcrypt')
const { User, validate } = require('../model/user');
const express = require('express');
const router = express.Router();

//show all users
router.get('/', async(req,res) => {
	//sending all data to response
	const users = await User.find().sort('name');
	res.send(users);
});

//get the data about a single user
router.get('/:id',async(req,res) => {
	//search using id In mongodb with mongoose
	const user = await User.findById(req.params.id);
	//checking if user not found then 404 request & if found then send the response
	if(!user) return res.status(404).send(`Sorry! We don't have anything like this`)
	res.send(user);
});

//insert a new data in users
router.post('/', async(req,res) => {
	//validate using Joi, with factoring function & error checking
	const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');

        
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
		
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt)
		
		user = await user.save();

		const token = user.generateAuthToken();

		res
			.header('x-auth-token', token)
			.header("access-control-expose-headers", "x-auth-token")
			.send(_.pick(user, ['_id','name', 'email', 'password']));
	
});

//update a existing data Using MongoDB
router.put('/:id',async(req,res)=>{
	//error checking
	const { error } = validate(req.body);
	if(error){
		return res.status(400).send(error.details[0].message);
	}
	//find Id and updated it by mongoose
	const user = await User.findByIdAndUpdate(req.params.id, { name:req.body.name }, {
		new: true
	})
	// if user is not available then error orelse new updated data send to user
	if(!user) return res.status(404).send(`Sorry! We don't have anything like this`);
	else{
		res.send(user);
	}

});

router.delete('/:id',async(req,res) =>{

	//find an delete the data using moongoose & mongodb
	const user = await User.findByIdAndRemove(req.params.id);

	//checking if user not found then 404 request & if found then send the response
	if(!user) return res.status(404).send(`Sorry! We don't have anything like this`);

	//finally response send with deleted data
	res.send(user);

});


//export it for accessing
module.exports = router;