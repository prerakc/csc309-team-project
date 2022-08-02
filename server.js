/* server.js for react-express-authentication */
"use strict";

/* Server environment setup */
// To run in development mode (no session management), run normally: node server.js
// To run in production mode (with session management), run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV // read the environment variable (will be 'production' in production mode)
//////


const log = console.log;
const path = require('path')

const express = require("express");
// starting the express server
const app = express();

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require('cors')
if (env !== 'production') { app.use(cors()) }

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
// Mongoose 6 always behaves as if useFindAndModify is false
// mongoose.set('useFindAndModify', false); // for some deprecation issues

// to validate object IDs
const { ObjectID } = require("mongodb");

const { initDB } = require("./db/InitDatabase");
initDB().then()

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require('body-parser') 
app.use(bodyParser.json()) // parsing JSON body
app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)


if (env === 'production') {
    // express-session for managing user sessions
    const session = require("express-session");
    const MongoStore = require('connect-mongo') // to store session information on the database in production

    /*** Session handling **************************************/
    /// Middleware for creating sessions and session cookies.
    // A session is created on every request, but whether or not it is saved depends on the option flags provided.
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
            resave: false, // don't resave an session that hasn't been modified.
            saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
            cookie: { // the session cookie sent, containing the session id.
                expires: 60*60*1000, // 1 hour expiry
                httpOnly: true // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
            },
            // store the sessions on the database
            store: MongoStore.create({mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/WebDevTeamProject'})
        })
    );
}

/*** API Routes below ************************************/
app.use(require('./routes/AccountRoutes'))
app.use(require('./routes/ListingRoutes'))
app.use(require('./routes/ProfileRoutes'))
app.use(require('./routes/ConversationRoutes'))

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // // check for page routes that we expect in the frontend to provide correct status code.
    // const goodPageRoutes = ["/", "/login", "/dashboard"];
    // if (!goodPageRoutes.includes(req.url)) {
    //     // if url not in expected page routes, set status to 404.
    //     res.status(404);
    // }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
