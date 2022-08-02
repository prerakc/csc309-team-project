const log = console.log

const env = process.env.NODE_ENV

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the student mongoose model
const { Listing } = require('../models/ListingModel')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
// const { authenticate } = require("./helpers/authentication");
const { userLoggedIn, adminLoggedIn } = require("./helpers/authentication");

// to validate object IDs
const { ObjectID } = require('mongodb')



// POST /api/listing => create listing (return UUID)
// GET /api/listing => get all listings
// DELETE /api/listing/:UUID => delete listing

// POST /api/listing/:UUID/report => create report
// GET /api/listing/report => get all reports (Includes whole listing for all with reports)
// DELETE /api/listing/:UUID/report => delete report


// Expects body like:
// {
// 	title: String
// 	createdby: String	//username?
// 	description: String
//  subjects: List[String]
// 	istutor: Bool
// 	price: Float
// 	date: datetime (optional)
// 	report: Report (default: NULL) (optional)
// }
// returns the listing added
router.post('/api/listing', mongoChecker, userLoggedIn, async (req, res) => {
	const listing = new Listing({
		title: req.body.title,
        createdBy: req.body.createdBy,
        description: req.body.description,
		subjects: req.body.subjects,
        istutor: req.body.istutor,
        price: req.body.price,
        date: req.body?.date,
        report: req.body?.report
	})

	if (env === 'production') {
		if (req.session.username !== req.body.createdBy) {
			res.status(403).send('Request forbidden');
			return;
		}
	}

	try {
		const result = await listing.save()	
		res.send(result)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

//get all listings
router.get('/api/listing', mongoChecker, userLoggedIn, async (req, res) => {
	try {
		const result = await Listing.find()	
		res.send(result)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

//deletes the listings and returns the listing that was delted
router.delete('/api/listing/:id', mongoChecker, userLoggedIn, async (req, res) => {
	// Add code here
	const id = req.params?.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// If id valid, findById
	try {
		const listing = await Listing.findOne({_id: id}) 
		if (!listing) {
			res.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we might wrap returned object in another object:
			//res.send({student})
			await listing.remove()
			// await listing.save()
			res.send({listing})
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})




// Expects Body as:
// {
// 	By: String	//username?
// 	Description: string
// }
// returns the listing with the report
router.post('/api/listing/report/:id', mongoChecker, userLoggedIn, async (req, res) => {
	// const report = new Report({
	// 	by: req.body.by,
    //     description: req.body.description,
	// })
    const id = req.params?.id
	req.body.isreported = true;

	if (env === 'production') {
		if (req.session.username !== req.body.by) {
			res.status(403).send('Request forbidden');
			return;
		}
	}

	try {
		const listing = await Listing.findOne({_id: id}) 
		if (!listing) {
			res.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we might wrap returned object in another object:
			//res.send({student})
			listing.report = req.body;
			await listing.save()
			res.send({listing})
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
})

//get all listings that were reported
router.get('/api/listing/report', mongoChecker, userLoggedIn, async (req, res) => {
	try {
		const result = await Listing.find({ 'report.isreported': true })	
		res.send(result)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})


//deletes the listings and returns the listing that was delted
router.delete('/api/listing/report/:id', mongoChecker, userLoggedIn, async (req, res) => {
	// Add code here
	const id = req.params?.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// If id valid, findById
	try {
		const listing = await Listing.findOne({_id: id}) 
		if (!listing) {
			res.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we might wrap returned object in another object:
			//res.send({student})
			listing.report = {by: "", description: "", isreported: false}
			await listing.save()
			res.send({listing})
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	}

})


module.exports = router
