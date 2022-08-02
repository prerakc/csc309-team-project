// import new_account from "../resources/new_account.jpg"

const log = console.log
const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the student mongoose model
const { Profile } = require('../models/ProfileModel')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { userLoggedIn, adminLoggedIn } = require("./helpers/authentication");

// to validate object IDs
const { ObjectID } = require('mongodb')

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// cloudinary: configure using credentials found on your Cloudinary Dashboard
// sign up for a free account here: https://cloudinary.com/users/register/free
const cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'dxbeljoy1', 
    api_key: '####', 
    api_secret: '####' 
  });

router.post('/api/profile/:username', mongoChecker, async (req, res) => {
	const username = req.params.username

	try {
		const exists = await Profile.exists({username: username})
		if (exists !== null) {
			res.status(409).send('Profile already exists')
		} else {
			const profile = new Profile({
				username: username,
				name: "default name",
				email: "default@email.com",
				phone: "default phone",
				description: "default desc.",
				picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648698823/new_account.jpg",
				student_rating: 0,
				student_votes: 0,
				student_reviews: [],
				tutor_rating: 0,
				tutor_votes: 0,
				tutor_reviews: [],
				type: "user"
			})
			const result = await profile.save()
			res.send(result)
		}
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

router.get('/api/profile', mongoChecker, userLoggedIn, async (req, res) => {
	try {
		const profiles = await Profile.find()
		res.send(profiles)
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

router.get('/api/profile/:username', mongoChecker, userLoggedIn, async (req, res) => {
	// console.log("test")
	// console.log(req.session)
	
	const username = req.params.username

	try {
		const profile = await Profile.findOne({username: username})
		if (!profile) {
			res.status(404).send('Profile not found')
		} else {
			res.send(profile)
		}
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

router.patch('/api/profile/:username/type', mongoChecker, adminLoggedIn, async (req, res) => {
	const username = req.params.username

	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		res.status(400).send('Bad Request')
		return;
	}

	// Find the fields to update and their values.
	const fieldsToUpdate = {}
	req.body.map((change) => {
		const propertyToChange = change.path.substr(1) // getting rid of the '/' character
		fieldsToUpdate[propertyToChange] = change.value
	})

	if ("type" in fieldsToUpdate && Object.keys(fieldsToUpdate).length === 1) {
		// Find the profile with the specified username and update it
		try {
			const profile = await Profile.findOneAndUpdate({username: username}, {$set: fieldsToUpdate}, {new: true})
			if (!profile) {
				res.status(404).send('Profile not found')
			} else {   
				res.send(profile)
			}
		} catch (error) {
			log(error)
			if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request') // bad request for changing the student.
			}
		}
	} else {
		res.status(400).send('Bad Request')
	}
})

router.patch('/api/profile/:username/profile', mongoChecker, userLoggedIn, async (req, res) => {
	const username = req.params.username

	if (env === 'production') {
		if (username !== req.session.username) {
			res.status(401).send("Unauthorized")
			return;
		}
	}
	

	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		res.status(400).send('Bad Request')
		return;
	}

	// Find the fields to update and their values.
	const fieldsToUpdate = {}
	req.body.map((change) => {
		const propertyToChange = change.path.substr(1) // getting rid of the '/' character
		fieldsToUpdate[propertyToChange] = change.value
	})

	if ("type" in fieldsToUpdate || "username" in fieldsToUpdate || "picture" in fieldsToUpdate || "student_rating" in fieldsToUpdate || "student_votes" in fieldsToUpdate || "student_reviews" in fieldsToUpdate || "tutor_rating" in fieldsToUpdate || "tutor_votes" in fieldsToUpdate || "tutor_reviews" in fieldsToUpdate) {
		res.status(400).send('Bad Request')
	} else {
		// Find the profile with the specified username and update it
		try {
			const profile = await Profile.findOneAndUpdate({username: username}, {$set: fieldsToUpdate}, {new: true})
			if (!profile) {
				res.status(404).send('Profile not found')
			} else {   
				res.send(profile)
			}
		} catch (error) {
			log(error)
			if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request') // bad request for changing the student.
			}
		}
	}
})

router.post('/api/profile/:username/picture', multipartMiddleware, mongoChecker, userLoggedIn, async (req, res) => {
	const username = req.params.username

	if (env === 'production') {
		if (username !== req.session.username) {
			res.status(401).send("Unauthorized")
			return;
		}
	}

	// Use uploader.upload API to upload image to cloudinary server.
    cloudinary.uploader.upload(
		req.files.image.path, // req.files contains uploaded files
        function (result) {

			const profile = Profile.findOneAndUpdate({username: username}, {$set: {picture: result.url}}, {new: true})

			profile.then(newProfile =>
				res.send(newProfile)
			).catch(error => {
				log(error)
				if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
					res.status(500).send('Internal server error')
				} else {
					res.status(400).send('Bad Request') // bad request for changing the student.
				}
			})
    	}
	);
})

router.delete('/api/profile/:username', mongoChecker, adminLoggedIn, async (req, res) => {
	const username = req.params.username

	// Find the profile with the specified username and delete it
	try {
		const profile = await Profile.findOneAndDelete({username: username})
		if (!profile) {
			res.status(404).send('Profile not found')
		} else {
			res.send('Account and Profile deleted')
		}
	} catch (error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

router.post('/api/profile/:username/review/student', mongoChecker, userLoggedIn, async (req, res) => {
	const username = req.params.username

	if (env === 'production') {
		if (username === req.session.username) {
			res.status(400).send("Bad Request")
			return;
		}
	}

	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		res.status(400).send('Bad Request')
		return;
	}

	if (!('reviewer' in req.body && 'rating' in req.body && 'description' in req.body && 'date' in req.body)) {
		res.status(400).send('Bad Request')
		return;
	}

	// Find the profile with the specified username and update it
	try {
		const profile = await Profile.findOne({username: username})
		if (!profile) {
			res.status(404).send('Profile not found')
		} else {   
			// console.log(profile)
			profile.student_rating = (profile.student_votes * profile.student_rating + req.body.rating)/(profile.student_votes + 1)
			profile.student_votes = profile.student_votes + 1
			profile.student_reviews.push({
				reviewer: req.body.reviewer,
				rating: req.body.rating,
				description: req.body.description,
				date: req.body.date
			})
			const result = await profile.save()
			res.send(result)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

router.post('/api/profile/:username/review/tutor', mongoChecker, userLoggedIn, async (req, res) => {
	const username = req.params.username

	if (env === 'production') {
		if (username === req.session.username) {
			res.status(400).send("Bad Request")
			return;
		}
	}

	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		res.status(400).send('Bad Request')
		return;
	}

	if (!('reviewer' in req.body && 'rating' in req.body && 'description' in req.body && 'date' in req.body)) {
		res.status(400).send('Bad Request')
		return;
	}

	// Find the profile with the specified username and update it
	try {
		const profile = await Profile.findOne({username: username})
		if (!profile) {
			res.status(404).send('Profile not found')
		} else {   
			// console.log(profile)
			profile.tutor_rating = (profile.tutor_votes * profile.tutor_rating + req.body.rating)/(profile.tutor_votes + 1)
			profile.tutor_votes = profile.tutor_votes + 1
			profile.tutor_reviews.push({
				reviewer: req.body.reviewer,
				rating: req.body.rating,
				description: req.body.description,
				date: req.body.date
			})
			const result = await profile.save()
			res.send(result)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

module.exports = router
