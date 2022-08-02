# CSC309 Team 11 Group Project: TutorMe

## How to Use
Authenticate using one of the two provided accounts below. To use one of the described features, click on the respective button in the navigation bar
### Login credentials
  * Standard User
      * Username: user
      * Password: user
  * Admin
      * Username: admin
      * Password: admin

## Authentication
### Feature Description
* Users can login with a currently existing account or register and make a new standard account
### End User Interactions
* To authenticate, users can either select the login or register button on the splash page and then fill out and submit their respective forms
* When logging in, the user must provide a valid username and password
* When registering,the desired username must not already exist

## Listings
### Feature Description
* Currently available student or tutor listing are displayed
* Listings show the user the title, description, price and subjects of the listing in text
* The type of post is displayed by a chalkboard icon or mortarboard hat respectively in the top right of listing. It is also displayed textually under the user name.
* the Student or tutor rating of a listing (depending on listing type) is displayed under the profile section of listing
* prices are suggested to be on an hourly basis but can be whatever the user decides to put and may add details on their pricing to the description
### End User Interactions
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
### Feature Description
* Users are able to message each other by first clicking the message button on another user's profile, this will create a conversation between the two parties.
* Through the message panel, users can select from their existing conversations, and send messages between each other.
* Through the message panel, tutor’s can students can agree on meeting times, location, prices, and dates by the tutor submitting an invoice to the student. This then allows us to keep a record of their agreements in the event that the student ends up not paying, or the tutor ends up not showing.
* Once the invoice is accepted, the tutor and the student are allowed to submit a review of one another. We opted to implement it this way in order to guarantee that reviews could not be submitted by anyone, limiting artificial inflation of user’s ratings.
### End User Interactions
* Users can select a chat from a list of existing conversations
* Users can send messages through an input dialogue.
* Tutors can submit an invoice to the student to agree on a meeting time and place through an invoice modal.
* Students and tutors can leave a review per each accepted invoice by providing a 0-5 star rating, and some comments if they like.
* Users can also refresh the chat to simulate additional incoming messages from the other party.

## Profile
### Feature Description
* A user can view their own profile, which consists of their profile picture, bio and ratings given by other users
* They can only edit the personal information in their own bio
* They can view all registered accounts and see a particular user’s profile
* Certain admin functionality is conditionally rendered in these views
### End User Interactions
* When viewing their own profile, users can click the Edit/Save button to persist changes to their profile bio
* Users can see a summary of all registered accounts by clicking the “View All Profiles” button
  * Clicking on a particular user’s profile picture will let them see that person’s profile
  * Additionally, admin users can delete an account and grant/revoke admin privileges by pressing the respective buttons
* Clicking on the profile picture of someone who left a review will take you to their profile

## Admin Panel
### Feature Description
* Dedicated panel for viewing reported listings
* Each shown listing will display the reason for reporting and who reported it
### End User Interactions
* Admins can select “Delete Post” to delete the listing
* They can also navigate to the listing creator’s profile by clicking on their profile picture
* If admins want to unreport a particular listing, they can select the "Unreport" button

## Third Party Libraries Used
* React
* React Router
* React UID
* Material UI
* date-fns

## Note about Back-end Fetching 

All of the data in the contexts will be fetched from a database residing on the server. So everytime a context is called the data will be refreshed from the server's data. In phase 2 the backend will fill contexts with data.

### Account context

Wrapper around api calls used for database context. 

### Database context

Server-side  profile data.

### Listings context

Server-side listings data.

### Message context

Server-side messages data.