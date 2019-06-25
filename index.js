//required library list
const express = require('express');
const app = express();
const Joi = require('joi');

// for parsing application/json
app.use(express.json());

//current static db
const genres = [
	{id: 1, name: 'genres1'},
	{id: 2, name: 'genres2'},
	{id: 3, name: 'genres3'},
];

//show all genres
app.get('/api/genres',(req,res) => {
	//sending all data to response
	res.send(genres);
});

//get the data about a single genre
app.get('/api/genres/:id',(req,res) => {
	//checking the genre with given id
	const genre = genres.find(g => g.id === parseInt(req.params.id))
	//checking if genre not found then 404 request & if found then send the response
	if(!genre) return res.status(404).send(`Sorry! We don't have anything like this`)
	res.send(genre);
});

//insert a new data in genres
app.post('/api/genres', (req,res) => {
	//validate using Joi, with factoring function
	const { error } = validateGenre(req.body);
	//if have any error then return bad request with error else just add the new one
	if(error){
		return res.status(400).send(error.details[0].message);
	}else{
		const genre = {
			id : genres.length+1,
			name : req.body.name
		};
		genres.push(genre);
		res.send(genre);
	}

});

//update a existing data
app.put('/api/genres/:id',(req,res)=>{

	//For update first checking the id is available in the database
	//checking the genre with given id
	const genre = genres.find(g => g.id === parseInt(req.params.id))
	//checking if genre not found then 404 request & if found then send the response
	if(!genre) return res.status(404).send(`Sorry! We don't have anything like this`);

	//For update checking the input validation & update the data
	//validate using Joi, with factoring function
	const { error } = validateGenre(req.body);
	//if have any error then return bad request with error else just add the new one
	if(error){
		return res.status(400).send(error.details[0].message);
	}else{
		//update the name & request sent
		genre.name = req.body.name;
		res.send(genre);
	}

});

app.delete('/api/genres/:id',(req,res) =>{

	//checking the genre with given id
	const genre = genres.find(g => g.id === parseInt(req.params.id))
	//checking if genre not found then 404 request & if found then send the response
	if(!genre) return res.status(404).send(`Sorry! We don't have anything like this`);

	//find the genre in the db and splice it
	const index = genres.indexOf(genre);
	genres.splice(index, 1);
	//finally response send with deleted data
	res.send(genre);

});


//validation using Joi
function validateGenre(genre){
	//initialing the shema for validation parameters
	const schema = {
		name : Joi.string().min(3).required()
	};
	//finally return the result of validation
	return Joi.validate(genre, schema);
}




//Port through server port or else it will be 3000
const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`listening on port ${port}`));