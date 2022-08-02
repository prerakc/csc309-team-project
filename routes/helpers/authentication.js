
// helpers for authentication

const { Account } = require('../../models/AccountModel')
const { Profile } = require('../../models/ProfileModel')

const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)

module.exports = {
	// Middleware for authentication of resources
	userLoggedIn: (req, res, next) => {
		if (env === 'production') {
			if (req.session.username) {
				Account.findOne({username: req.session.username}).then((user) => {
					if (!user) {
						return Promise.reject()
					} else {
						next()
					}
				}).catch((error) => {
					res.status(401).send("Unauthorized")
				})
			} else {
				res.status(401).send("Unauthorized")
			}
		} else {
			next()
		}
	},

	adminLoggedIn: (req, res, next) => {
		if (env === 'production') {
			if (req.session.username) {
				Profile.findOne({username: req.session.username, type: "admin"}).then((user) => {
					if (!user) {
						return Promise.reject()
					} else {
						next()
					}
				}).catch((error) => {
					res.status(401).send("Unauthorized")
				})
			} else {
				res.status(401).send("Unauthorized")
			}
		} else {
			next()
		}
	}
}