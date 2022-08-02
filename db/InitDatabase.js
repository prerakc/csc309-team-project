const {Account} = require('../models/AccountModel')
const {Conversation} = require('../models/ConversationModel')
const {Listing} = require('../models/ListingModel')
const {Profile} = require('../models/ProfileModel')


const clearDB = async () => {
    await Account.deleteMany({})
    await Conversation.deleteMany({})
    await Listing.deleteMany({})
    await Profile.deleteMany({})
}


const initListingsDB = async () => {
    const hardcoded_listings = [
        {
            title: "Paulson's Dojo",
            createdBy: "robert_paulson",
            description:
                "The first rule of project mayhem is you do not ask question. His name was Robert Paulson.",
            subjects: ["waiting", "Martial Arts", "Vandalism", "Yelling"],
            istutor: true,
            // rating: fetchProfileNoPassword("robert_paulson").profile.tutor_rating,
            price: 500,
            date: new Date(2022, 0, 24, 10, 33, 30, 0),
            report: {
                isreported: true,
                by: "user",
                description: "abuse"
            }
        },
        {
            title: "Hippies Delight",
            createdBy: "jossepe_fergusson",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat, risus eget accumsan pharetra, leo dolor scelerisque dolor, id eleifend dolor odio non neque. Vestibulum volutpat quam diam, in finibus ipsum dignissim nec. Maecenas auctor laoreet leo, a lacinia orci. Sed cursus lorem sit amet vestibulum dignissim. Vestibulum eu dui consequat magna lobortis molestie. Nullam vel diam sagittis augue semper pulvinar. Donec tristique hendrerit arcu non ornare. Curabitur scelerisque ornare porta. Maecenas hendrerit ultrices orci.",
            subjects: [
                "Basket Weaving",
                "Crystal Healing",
                "Voodoo",
                "Particle Physics"
            ],
            istutor: true,
            // rating: fetchProfileNoPassword("jossepe_fergusson")?.profile.tutor_rating ? fetchProfileNoPassword("jossepe_fergusson")?.profile.tutor_rating : 0,
            price: 1500,
            date: new Date(2022, 1, 24, 10, 33, 30, 0),
            report: {
                isreported: false,
                by: "",
                description: ""
            }
        },
        {
            title: "Listing by Prerak Chaudhari",
            createdBy: "user",
            description:
                "This is a listing created by the default user account",
            subjects: ["Basket Weaving", "waiting", "Particle Physics"],
            istutor: false,
            // rating: fetchProfileNoPassword("user")?.profile.student_rating ? fetchProfileNoPassword("user").profile.student_rating : 0,
            price: 100,
            date: new Date(2022, 2, 1, 10, 33, 30, 0),
            report: {
                isreported: false,
                by: "",
                description: ""
            }
        }
    ];


    hardcoded_listings.map(async (listing) => {
        const defaultListing = new Listing({
            title: listing.title,
            createdBy: listing.createdBy,
            description: listing.description,
            subjects: listing.subjects,
            istutor: listing.istutor,
            price: listing.price,
            date: listing.date,
            report: listing.report
        })
        await defaultListing.save()
    })

}

const initAccountDB = async () => {
    const hardcoded_accounts = [
        {
            username: "user",
            password: "user"
        },
        {
            username: "admin",
            password: "admin"
        },
        {
            username: "robert_paulson",
            password: "robert_paulson"
        },
        {
            username: "jossepe_fergusson",
            password: "jossepe_fergusson"
        }
    ];


    hardcoded_accounts.map(async (account) => {
        const defaultAccount = new Account({
            username: account.username,
            password: account.password
        })
        await defaultAccount.save()
    })
}

const initProfileDB = async () => {
    const hardcoded_profiles = [
        {
            username: "user",
            name: "Prerak Chaudhari",
            email: "prerak@website.com",
            phone: "1234567890",
            description: "I love CSC309",
            picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648687501/user.jpg",
            student_rating: 3,
            student_votes: 1,
            student_reviews: [
                {
                    reviewer: "admin",
                    rating: 3,
                    description: "ok student",
                    date: new Date()
                }
            ],
            tutor_rating: 4,
            tutor_votes: 1,
            tutor_reviews: [
                {
                    reviewer: "admin",
                    rating: 4,
                    description: "decent tutor",
                    date: new Date()
                }
            ],
            type: "user"
        },
        {
            username: "admin",
            name: "Website Admin",
            email: "admin@website.com",
            phone: "6666666666",
            description: "Admin Description",
            picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648698096/admin.jpg",
            student_rating: 2,
            student_votes: 1,
            student_reviews: [
                {
                    reviewer: "user",
                    rating: 2,
                    description: "doesn't show up on time",
                    date: new Date()
                }
            ],
            tutor_rating: 1,
            tutor_votes: 1,
            tutor_reviews: [
                {
                    reviewer: "user",
                    rating: 1,
                    description: "TRASH TRASH TRASH",
                    date: new Date()
                }
            ],
            type: "admin"
        },
        {
            username: "robert_paulson",
            name: "Robert Paulson",
            email: "rob@paulson.ca",
            phone: "1234567890",
            description: "Learn to kick ass and take names at Paulson's Dojo!",
            picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648698705/robert_paulson.jpg",
            student_rating: 0,
            student_votes: 0,
            student_reviews: [],
            tutor_rating: 4,
            tutor_votes: 1,
            tutor_reviews: [
                {
                    reviewer: "user",
                    rating: 4,
                    description: "Taught me to whoop butt!",
                    date: new Date()
                }
            ],
            type: "user"
        },
        {
            username: "jossepe_fergusson",
            name: "Jossepe Fergusson",
            email: "jossepe_fergusson@some_uni.edu",
            phone: "0123456789",
            description: "Expert basket weaver",
            picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648698731/jossepe_fergusson.jpg",
            student_rating: 0,
            student_votes: 0,
            student_reviews: [],
            tutor_rating: 1,
            tutor_votes: 1,
            tutor_reviews: [
                {
                    reviewer: "robert_paulson",
                    rating: 1,
                    description: "completely worthless",
                    date: new Date()
                }
            ],
            type: "user"
        }
    ];


    hardcoded_profiles.map(async (profile) => {
        const defaultProfile = new Profile({
            username: profile.username,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            description: profile.description,
            picture: profile.picture,
            student_rating: profile.student_rating,
            student_votes: profile.student_votes,
            student_reviews: profile.student_reviews,
            tutor_rating: profile.tutor_rating,
            tutor_votes: profile.tutor_votes,
            tutor_reviews: profile.tutor_reviews,
            type: profile.type
        })
        await defaultProfile.save()
    })
}

const initConversationDB = async () => {
    const userPaulsonPreDefinedMessages = [
        {
            invoice: false,
            sender: "user",
            content: "Hi Mr. Paulson, what time are you available for our first session?"
        },
        {
            invoice: false,
            sender: "robert_paulson",
            content: "Hi User, I am available any time on Saturday this week, what time works best for you?"
        },
        {
            invoice: false,
            sender: "user",
            content: "How about 2pm?"
        },
        {
            invoice: false,
            sender: "robert_paulson",
            content: "That works for me, I will send you an invoice"
        },
        {
            invoice: true,
            open: true,
            status: 0,
            invoice_data: {
                date: new Date(),
                time: new Date(),
                location: "The Dojo",
                price: 10
            },
            sender: "robert_paulson",
            content: "Invoice Sent"
        }
    ];

    const conversations = [
        {
            user_one: "user",
            user_two: "robert_paulson",
            open_invoice: true,
            conversation: userPaulsonPreDefinedMessages
        },
        {
            user_one: "user",
            user_two: "jossepe_fergusson",
            open_invoice: false,
            conversation: []
        }
    ];

    conversations.map(async conversationData => {
        const conversation = new Conversation({
            user_one: conversationData.user_one,
            user_two: conversationData.user_two,
            open_invoice: conversationData.open_invoice,
            conversation: conversationData.conversation
        });

        await conversation.save();
    })
}


const initDB = async () => {
    await clearDB();
    await initListingsDB();
    await initAccountDB();
    await initProfileDB();
    await initConversationDB();
}


module.exports = {initDB}