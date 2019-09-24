const mongoose = require('mongoose');
const Joi = require('joi');

//Create schema for the mongodb
const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
		type: String,
		required: true,
		minlength: 7,
		maxlength: 11
    }
})

//create model by mongoose
const Customer = mongoose.model('Customer', customerSchema);

//validation using Joi
function validateCustomer(customer){
	//initialing the shema for validation parameters
	const schema = {
        name : Joi.string().min(5).max(50).required(),
        phone : Joi.string().min(5).max(11).required(),
        isGold : Joi.boolean()
	};
	//finally return the result of validation
	return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;