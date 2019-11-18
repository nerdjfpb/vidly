const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
//Create schema for the mongodb
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
    },
    email: {
		type: String,
		required: true,
		minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024
		},
		isAdmin: {
			type: Boolean,
			required: true
		}
})

userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign({_id: this._id}, 'jwtPrivateKey');
	return token;
}

//create model by mongoose
const User = mongoose.model('User', userSchema);

//validation using Joi
function validateUser(user){
	//initialing the shema for validation parameters
	const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required()
	};
	//finally return the result of validation
	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;