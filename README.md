# CSC309 Team 11 Group Project: TutorMe

Link: https://agile-garden-08951.herokuapp.com/

## Setup

### **Database**
Start your local Mongo database.  For example, in a separate terminal window:

```
# create and run local Mongo database in the root directory of the repo
mkdir mongo-data
mongod --dbpath mongo-data
```

### **Package installation**
Then, in the root directory of the repo, run:
```
# install server dependencies in the root directory
npm install

# install frontend dependencies in the client directory
cd client
npm install
```

Alternatively, you can run `npm run setup` in the root directory which runs a script to execute all the above commands (not including starting the mongo database, since it should be run in a separate window). This is a shortcut command defined in [package.json](package.json).

During development, run the following commands to build your React app and start the Express server.  You should re-run these commands for your app to reflect any changes in the code. Make sure mongo is still running on a separate terminal.

### **Development with no session management**
Session management is disabled when the `NODE_ENV` environment variable is not set to `production`. This was done because the react development server was not storing cookies on the client-side and each request generated a new session. As a result, the client would recieve 401 (Unauthorized) errors, breaking app functionality that depends on fetching information from the server. To test the app without session session management, first make sure that `NODE_ENV` is not set to `production`; then, open two terminals and cd into the root project directory.

In one terminal:
```
# run the server
node server.js
```

In the other terminal:
```
# run the react development server
cd client
npm start
```

NOTE: the react development server automatically sets `NODE_ENV` to `development` FOR ITSELF. The server is not affected by this change and will read whatever value is defined as an environment variable. Thus make sure that the environment variable `NODE_ENV` is not defined or is not set to `production`.

Visit `localhost:3000` to use the app. Send API requests to `localhost:5000`.

### **Development with session management**
Session management allows logged-in users of the app to refresh and remain logged in. Furthermore, some additional checks are performed on the backend for certain routes. For example, with session management enabled, a logged-in user will not be able to modify the profile of another account. Additionally, any routes that require a user to be logged in or even be an admin will not be accessible to those who don't meet the requirements. To test the app with session session management, first make sure that `NODE_ENV` is set to `production`; then, open a terminal, cd into the root project directory, and enter:
```
# build the React app
cd client
npm run build

# go back to the root directory
cd ..

# run the server
node server.js
```

Alternatively, you can run `npm run build-run` in the root directory which runs a script to execute all the above commands. This is a shortcut command defined in [package.json](package.json).

NOTE: the production-built react app automatically sets `NODE_ENV` to `production` FOR ITSELF. The server is not affected by this change and will read whatever value is defined as an environment variable. Thus make sure that the environment variable `NODE_ENV` is set to `production`.

*NIX users can run easily set the `NODE_ENV` environment variable as follows:
```
# build the React app
cd client
npm run build

# go back to the root directory
cd ..

# run the server with NODE_ENV set to production
 NODE_ENV=production node server.js
```

Windows users can do the following from the command prompt:
```
# Define NODE_ENV environment variable in local command prompt process;
# goes away when command prompt is closed
SET NODE_ENV=production

# build and run the app
npm run build-run
```

Visit `localhost:5000` to use the app. Also send API requests to `localhost:5000`.

## Deployment

The `start` and `heroku-postbuild` scripts included in [package.json](package.json) will tell Heroku how to run your app.  You can deploy to Heroku easily:

```
# switch to main branch
git checkout main

# create a new empty Heroku app in the root directory (only need to be done once)
heroku create

# deploy the latest committed version of your code on branch `main` to Heroku
git push heroku
```

Don't forget to set the `MONGODB_URI` environmental variable to use a cloud Mongo database (like Atlas).

## API Routes
* POST /api/account/login
  * This route is used for login authentication and when session management is enabled, returns a cookie with a session ID
  * Request JSON body:
    ```
    {"username": String, "password": String}
    ```
    * `username` is the account username
    * `password` is the account password
  * On successful 200 status codes, returns the profile of the specified account
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* GET /api/account/logout
  * This route is used to logout a user
  * When session management is enabled, destroys the request's session and returns a success/error status code dependent upon the session deletion process
  * Otherwise, returns a 200
  
* GET /api/account/check-session
  * This route is for logged-in users to check via a request if they have a session
  * If the request has a session, returns their profile
  * Otherwise, returns an error code (i.e. 401 Unauthorized)
  
* POST /api/account/register
  * This route is used for registering new user accounts
  * Request JSON body:
    ```
    {"username": String, "password": String}
    ```
    * `username` is the account username
    * `password` is the account password
  * On successful account and profile creations, returns the newly created profile but does not login user
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* DELETE /api/account/:username
  * This route is used by logged-in admins (when session management is enabled) to delete the account and profile associated with the specified user
  * Returns a 200 if the account and profile are successfully deleted
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* POST /api/profile/:username
  * This route is internally used by `POST /api/account/register` to create a profile
  * Should not be used publicly for data consistency
  
* GET /api/profile
  * This route is used by logged-in users to retrieve the profiles of all accounts
  * Returns all the profiles on success
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* GET /api/profile/:username
  * This route is used by logged-in users to retrieve the profile of the specified user
  * Returns the specified profile on success
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* PATCH /api/profile/:username/type
  * The route is used by logged-in admins to change the admin credentials of a specified user
  * Request JSON body:
    ```
    [{"op": "replace", "path": "/type", "value": "type"}]
    ```
    * `type` is either `user` or `admin`
    * If other paths are passed in seperate objects of the array, a 400 (Bad Request) is returned
  * Returns the updated profile on success
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* PATCH /api/profile/:username/profile
  * The route is used to change the name, phone, email and description of a profile
  * When session management is enabled, logged-in users can only modify their own profile
  * Request JSON body (prettified below, should be single line in Postman):
    ```
    [
        {"op": "replace", "path": "/name", "value": String},
        {"op": "replace", "path": "/email", "value": String},
        {"op": "replace", "path": "/phone", "value": String},
        {"op": "replace", "path": "/description", "value": String}
    ]
    ```
    * If other paths are passed in seperate objects of the array, a 400 (Bad Request) is returned
  * Returns the updated profile on success
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* POST /api/profile/:username/picture
  * This route is used to change the profile picture of an account
  * When session management is enabled, logged-in users can only modify their own profile
  * Uploads file in `req.body.image.path` to Cloudinary and updates the image URL in the profile
  * Returns the updated profile on success
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* DELETE /api/profile/:username
  * This route is used by logged-in admins (when session management is enabled) to delete the profile of an account
  * It is used internally by `DELETE /api/account/:username`
  * Should not be used publicly for data consistency
  
* POST /api/profile/:username/review/student
  * This route is used to add a student review (i.e. how this person was as a student) to the specified user's profile
  * When session management is enabled, it can only be used logged-in users and the specified user in the URL cannot be the same as the session user
  * Request JSON body (prettified below, should be single line in Postman):
    ```
    {
        "reviewer": String,
        "rating": Number,
        "description": String,
        "date": Date
    }
    ```
  * Returns the updated profile on successfull review addition
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* POST /api/profile/:username/review/tutor
  * This route is used to add a tutor review (i.e. how this person was as a tutor) to the specified user's profile
  * When session management is enabled, it can only be used logged-in users and the specified user in the URL cannot be the same as the session user
  * Request JSON body (prettified below, should be single line in Postman):
    ```
    {
        "reviewer": String,
        "rating": Number,
        "description": String,
        "date": Date
    }
    ```
  * Returns the updated profile on successfull review addition
  * Otherwise, returns an error status code dependent upon the type of occured error
  
* POST /api/listing

  * Used to create a new listing

  * JSON body as below (prettified below, should be single line in Postman):

    ```{
    {
    	"title": String
    	"createdBy": String
    	"description": String
    	"subjects": [String]
    	"istutor": Boolean
    	"price": Float
    }
    ```

    * `title` is the title of the listing
    * `createdBy` Is the username who created the listing
    * `description` The body text of the listing
    * `subjects` Array of subjects for the listing 
    * `istutor` where the listing created by student (false) or tutor (true)
    * `price` The price of the listing as a float

* GET /api/listing

  * Used to get all the listings
  * Can only be used by logged in users (of any type regular or admin)

* Delete/api/listing/:id

  * Used to Delete the listings with `id `
  * Can only be used by logged in users or admins
    * Regular users need access to this since they must be allowed to delete their own listings

* POST /api/listing/report/:id

  * Used to create a report for a listing (with id `id`) and tag it as reported.

  * JSON body as below (prettified below, should be single line in Postman):

    ```{
    {
     	By: String	
     	Description: String
    }
    ```

    * `By` is the username how reported the listing
    * `Description` is what the user reported the listing for e.g. Profanity

* Get /api/listing/report/

  * returns all listings that have been reported
  * Can only be used by admins since they are the only onces that should be fetching listings by reported status

* Delete /api/listing/report/:id

  * Unreports a listing
  * can only be used by admins since they are the only onces that should be reviewing reported listings

* POST /api/conversation
    * Create a conversation between two users.
    * JSON body is required to be in the following format where each user_one and user_two are valid user accounts and one of the users is the one making the request:
    ```{
    {
     	user_one: String
        user_two: String
    }
    ```
    * If deployed in production, the session caller must be equal to one of the users in the payload. In development this is property is not verified.

* GET /api/conversation/:username
    * Fetch conversation documents username is a member of
    * If deployed in production, the session caller must be equal to username. In development this is property is not verified.
    
* POST /api/conversation/:conversation/message
    * Write a message to a conversation (this is either a text message or an invoice)
    * JSON body that is required is in the following format:
    ```{
    {
     	invoice: Boolean
        sender: String
        content: String
    }
    ```
    If the invoice property is set to true it is expected that the following sub-object is present in under the `invoice_data` field in the above object:
    ```{
    {
        date: Date
        time: Date
        location: String
        price: Number
    }
    ```
    * If deployed in production, sender must equal equal the session stored username. In development this is property is not verified.
    
* GET /api/conversation/:conversation/message
    * Fetch all messages from a conversation.
    * If deployed in production, the session caller must be a member of the conversation. In development this is property is not verified.
  
* PATCH /api/conversation/:conversation/:operation
    * Update the invoice status based on a user interaction.
    * Operation must be one of: `withdraw, reject, accept, review`.
        * Withdraw can be called by the sender of the invoice and it revokes the invoice and will display that it was revoked to both users
        * Reject can be called by the recipient of the invoice and it rejects the invoice and will display that it was rejected to both users
        * Accept can be called by the recipient of the invoice and it will progress the invoice into the review stage
        * Review can be called once by each user of the conversation, once both are submitted, the invoice is closed.
    * If deployed in production, the session caller must be a member of the conversation. In development this is property is not verified.

## How to Use
Authenticate using one of the two provided accounts below. To use one of the described features, click on the respective button in the navigation bar
### **Login credentials**
  * Standard User
      * Username: user
      * Password: user
  * Admin
      * Username: admin
      * Password: admin

## Authentication
### **Feature Description**
* Users can login with a currently existing account or register and make a new standard account
### **End User Interactions**
* To authenticate, users can either select the login or register button on the splash page and then fill out and submit their respective forms
* When logging in, the user must provide a valid username and password
* When registering,the desired username must not already exist

## Listings
### **Feature Description**
* Currently available student or tutor listing are displayed
* Listings show the user the title, description, price and subjects of the listing in text
* The type of post is displayed by a chalkboard icon or mortarboard hat respectively in the top right of listing. It is also displayed textually under the user name.
* the Student or tutor rating of a listing (depending on listing type) is displayed under the profile section of listing
* prices are suggested to be on an hourly basis but can be whatever the user decides to put and may add details on their pricing to the description
### **End User Interactions**
* Filter and sort listings by subjects, date, price, and rating
* Travel to listing poster’s profile page by clicking profile pic in listing
* messaging to users will occur from the users profile page via link to profile from listing
* Report listing to admins for misuse/abuse
* delete any listings if admin or own listing if created by logged in user
* allow user to create a new listing
	* title, description, price and between 1 and 5 subjects are required
	* title, description, and subjects are limited to 60, 300 and 15 characters respectively and all are single lines
	* to add subject simply type and hit enter in the subjects box
	* max price is 10000


## Messages
### **Feature Description**
* Users are able to message each other by first clicking the message button on another user's profile, this will create a conversation between the two parties.
* Through the message panel, users can select from their existing conversations, and send messages between each other.
* Through the message panel, tutor’s can students can agree on meeting times, location, prices, and dates by the tutor submitting an invoice to the student. This then allows us to keep a record of their agreements in the event that the student ends up not paying, or the tutor ends up not showing.
* Once the invoice is accepted, the tutor and the student are allowed to submit a review of one another. We opted to implement it this way in order to guarantee that reviews could not be submitted by anyone, limiting artificial inflation of user’s ratings.
### **End User Interactions**
* Users can select a chat from a list of existing conversations
* Users can send messages through an input dialogue.
* Tutors can submit an invoice to the student to agree on a meeting time and place through an invoice modal.
* Students and tutors can leave a review per each accepted invoice by providing a 0-5 star rating, and some comments if they like.
* Users can also refresh the chat to simulate additional incoming messages from the other party.

## Profile
### **Feature Description**
* A user can view their own profile, which consists of their profile picture, bio and ratings given by other users
* They can only edit the personal information in their own bio
* They can view all registered accounts and see a particular user’s profile
* Certain admin functionality is conditionally rendered in these views
### **End User Interactions**
* When viewing their own profile, users can click the Edit/Save button to persist changes to their profile bio
* While editing a profile, they can change their profile picture, name, phone, email and description; form validation is done on the email field to make sure it is a valid format
* Users can see a summary of all registered accounts by clicking the “View All Profiles” button
  * Clicking on a particular user’s profile picture will let them see that person’s profile
  * Additionally, admin users can delete an account and grant/revoke admin privileges by pressing the respective buttons
* Clicking on the profile picture of someone who left a review will take you to their profile

## Admin Panel
### **Feature Description**
* Dedicated panel for viewing reported listings
* Each shown listing will display the reason for reporting and who reported it
### **End User Interactions**
* Admins can select “Delete Post” to delete the listing
* They can also navigate to the listing creator’s profile by clicking on their profile picture
* If admins want to unreport a particular listing, they can select the "Unreport" button
* For granting/removing privileges' and deleting users see the Profile section

## Third Party Libraries Used

### **Client-side**
* React
* React Router
* React UID
* Material UI
* date-fns

### **Server-side**
* bcryptjs
* body-parser
* cloudinary
* connect-mongo
* connect-multiparty
* cors
* express
* express-session
* mongodb
* mongoose
* validator
