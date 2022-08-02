/* Listing mongoose model */
const mongoose = require('mongoose')


const ReportSchema = mongoose.Schema({
	by: {
		type: String,
		// required: true,
		minlegth: 1,
		trim: true,
		default: ""
	},
	description: {
		type: String,
		// required: true,
		minlegth: 1,
		maxlegth: 30, // ????
		trim: true,
		default: ""
	},
	isreported: {
		type: Boolean,
		default: false
	}
})


const ListingSchema = mongoose.Schema( {
	title: {
		type: String,
		required: true,
		minlegth: 1,
		maxlegth: 30, //TODO double check
		trim: true
	},
	createdBy: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	description: {
		type: String,
		required: true,
		minlegth: 1,
		maxlegth: 300,
		trim: true
	},
	subjects: {
		type: [String],
		required: true,
		minlegth: 1,
		minlegth: 30, //TODO double check
		trim: true
	},
	istutor: {
		type: Boolean,
		required: true
	},
	price: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
		default: new Date(Date.now())
	},
	report: {
		type: ReportSchema,
		default: { type: ReportSchema, default: () => ({}) }
	}

})

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = { Listing }




// Listings
// {
// 	Id: UUID
// 	Title: String
// 	createdBy: String	//username?
// 	Description: List[String]
// 	isTutor: Bool
// 	Price: Float
// 	Date: datetime
// 	Report: Report (default: NULL)
// }


// Report
// {
// 	By: String	//username?
// 	Description: string
// }
