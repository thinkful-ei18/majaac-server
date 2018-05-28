# safeR
SafeReport/safeR is an app that aims to keep the community safer by making sure they are up to date on local crimes or incidents in the area. When the app loads the user is greeted with a map with reports pinned in their local area. If the user chooses to sign up and login, they can submit a report or view the dashboard for previous reports they submitted themselves.

### Links

* Live app: https://safer.netlify.com/
* Github Client: https://github.com/thinkful-ei18/maajac-client
* Github Server: https://github.com/thinkful-ei18/majaac-server
* Github Mobile: https://github.com/thinkful-ei18/MOBILE-maajac-client

### Demo Account
username: demo <br>
password: demouser123

### The API
A RESTful API was created to handle the requests from the client portion of safeR. 

<b>'./auth.router.js'</b> -- the user login process using OAuth 2.0<br>
<b>''./routes/users.js</b> -- user creation process and the user's ability to add a profile picture (a profile photo can be added on web only)<br>
<b>'./Marker/markerRouter.js'</b> -- creating and filtering a marker from the map. Also details getting the user's markers for their dashboard and the route for how to delete one of their markers.


### Technology Stack
#### Front End - Web
* React
* Redux
* Google Maps
* HTML
* CSS
* Enzyme
* Jest

#### Front End - Mobile
* React Native
* Redux
* React Maps

#### Back End - Web & Mobile
* Node
* Express
* Mongoose
* MongoDB
* Mocha
* Chai
