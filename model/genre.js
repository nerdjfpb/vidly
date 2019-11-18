const Joi = require('joi');
const mongoose = require('mongoose');
//Create schema for the mongodb
const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	}
})
//create model by mongoose
const Genre = mongoose.model('Genre', genreSchema);

//validation using Joi
function validateGenre(genre){
	//initialing the shema for validation parameters
	const schema = {
		name : Joi.string().min(5).max(50).required()
	};
	//finally return the result of validation
	return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;