//require express and router to pass the router to index.js file
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../model/user');
const express = require('express');
const router = express.Router();

//insert a new data in users
router.post('/', async(req,res) => {
	//validate using Joi, with factoring function & error checking
	const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Invalid email or password');
  
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  // const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
  // const token = jwt.sign({_id: user._id}, 'jwtPrivateKey');
  const token = user.generateAuthToken();

  res.send(token);
  
});

//validation using Joi
function validate(req){
	//initialing the shema for validation parameters
	const schema = {
    email : Joi.string().min(5).max(255).required().email(),
    password : Joi.string().min(5).max(255).required()   
	};
	//finally return the result of validation
	return Joi.validate(req, schema);
}

//export it for accessing
module.exports = router;
