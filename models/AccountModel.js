/* Account mongoose model */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AccountSchema = new mongoose.Schema({
	username: {
        type: String,
		required: true,
		minlegth: 1,
		trim: true,
        unique: true
    },
    password: {
        type: String,
		required: true,
		minlegth: 1
    }
})

// Hash password prior to saving document
AccountSchema.pre('save', function(next) {
	const account = this; // binds this to Account document instance

	// checks to ensure we don't hash password more than once
	if (account.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(account.password, salt, (err, hash) => {
				account.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

// Static method to find Account document by comparing hashed password to provided one
AccountSchema.statics.findByUsernamePassword = function(username, password) {
	const Account = this // binds this to the Account model

	// First find the account by their username
	return Account.findOne({ username: username }).then((account) => {
		if (!account) {
			return Promise.reject("No account with specified username exists")  // a rejected promise
		}
		// if the account exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, account.password, (err, result) => {
				if (result) {
					resolve(account)
				} else {
					reject("Specified password is not correct")
				}
			})
		})
	})
}

const Account = mongoose.model('Account', AccountSchema)

module.exports = { Account }