/* Profile mongoose model */
const mongoose = require('mongoose')

const Review = new mongoose.Schema({
	reviewer: {
        type: String,
		required: true,
		minlegth: 1,
		trim: true
    },
    rating: {
        type: Number,
        required: true
    },
	description: {
		type: String,
		required: false,
        default: ""
	},
    date: {
        type: Date,
        required: true
    }
})


const Profile = mongoose.model('Profile', {
	username: {
        type: String,
		required: true,
		minlegth: 1,
		trim: true
    },
    name: {
        type: String,
		required: false,
		trim: true
    },
    email: {
        type: String,
		required: false,
		trim: true
    },
    phone: {
        type: String,
		required: false,
		trim: true
    },
    description: {
        type: String,
		required: false,
		trim: true
    },
    picture: {
        type: String,
        required: true
    },
    student_rating: {
        type: Number,
        required: true
    },
    student_votes: {
        type: Number,
        required: true
    },
    student_reviews: {
        type: [Review],
        required: true
    },
    tutor_rating: {
        type: Number,
        required: true
    },
    tutor_votes: {
        type: Number,
        required: true
    },
    tutor_reviews: {
        type: [Review],
        required: true
    },
    type: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
		required: true,
		minlegth: 1,
		trim: true
    }
})

module.exports = { Profile }
