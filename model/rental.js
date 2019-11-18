const mongoose = require('mongoose');
const Joi = require('joi');

//Create schema for the mongodb
const rentalSchema = new mongoose.Schema({
    customer : {
        type: new mongoose.Schema({
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
        }), 
        required: true  
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned:{
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

//create model by mongoose
const Rental = mongoose.model('Rental', rentalSchema);

//validation using Joi
function validateRental(rental){
	//initialing the shema for validation parameters
	const schema = {
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
	};
	//finally return the result of validation
	return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;