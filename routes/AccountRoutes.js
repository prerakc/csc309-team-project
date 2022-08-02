// import new_account from "../resources/new_account.jpg"

const log = console.log

const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the student mongoose model
const { Account } = require('../models/AccountModel')
const { Profile } = require('../models/ProfileModel')

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { userLoggedIn, adminLoggedIn } = require("./helpers/authentication");

// to validate object IDs
const { ObjectID } = require('mongodb')


router.post('/api/account/login', mongoChecker, async (req, res) => {	
	//console.log(req.session)
	
	if (!('username' in req.body && 'password' in req.body)) {
		res.status(400).send({})
		return;
	}

	const username = req.body.username
    const password = req.body.password

	try {
		const account = await Account.findByUsernamePassword(username, password);
		// dead block, ends up being handled in catch
		if (!account) {
            res.status(401).send({})
        } else {
			const profile = await Profile.findOne({username: username})
			// should never occur since deleting an account also deletes the profile
			// and creating an account also creates a profile
			if (!profile) {
				res.status(404).send({})
			} else {
				if (env === 'production') {
					req.session.username = profile.username
				}
				res.send(profile)
			}
        }
    } catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send({}) // 500 for internal server errors
		} else {
			if (error === "No account with specified username exists" || error === "Specified password is not correct") {
				res.status(401).send({}) // 401 for invalid credentials
			} else {
				res.status(400).send({}) // 400 for bad request gets sent to client.
			}
		}
	}
})

// A route to logout a user
router.get("/api/account/logout", (req, res) => {	
	if (env === 'production') {
		// Remove the session
		req.session.destroy(error => {
			if (error) {
				res.status(500).send(error);
			} else {
				res.send()
			}
		});
	} else {
		res.send()
	}
});

// A route to check if a user is logged in on the session
router.get("/api/account/check-session", mongoChecker, userLoggedIn, (req, res) => {
    // will throw a non-fatal error if accessing the
	// app through localhost:5000 while NODE_ENV isn't set for the backend
	//
	// NODE_ENV is automatically set to `production` for built react apps
	// but it will be `undefined` for the backend
	try {
		res.redirect(307, `/api/profile/${req.session.username}`)
	} catch (error) {
		log(error)
	}
});

router.post('/api/account/register', mongoChecker, async (req, res) => {
	if (!('username' in req.body && 'password' in req.body)) {
		res.status(400).send('Bad Request')
		return;
	}

	const username = req.body.username
    const password = req.body.password

	try {
		const account = await Account.findOne({username: username})
		if (!account) {
			const newAccount = new Account({
				username: username,
				password: password
			})
			const savedAccount = await newAccount.save()
			res.redirect(307, `/api/profile/${username}`)
		} else {
			res.status(409).send('Username taken')
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

// router.get('/api/account/logout', mongoChecker, async (req, res) => {})

router.delete('/api/account/:username', mongoChecker, adminLoggedIn, async (req, res) => {
	const username = req.params.username

	try {
		const account = await Account.findOneAndDelete({username: username})
		if (!account) {
			res.status(404).send('Account not found')
		} else {
			res.redirect(307, `/api/profile/${username}`)
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

module.exports = router
