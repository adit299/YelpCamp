const express = require("express"),
	  app = express(),
 	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  flash = require("connect-flash");
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comments"),
	  User = require("./models/user"),
	  seedDB = require("./seeds");

const commentRoutes = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes = require("./routes/index");

mongoose.set('useUnifiedTopology', true);

// Connecting the MongoDB database
mongoose.connect("mongodb://localhost/yelp_camp_v11", { useNewUrlParser: true });


// We should just get used to adding this bodyParser line of code (what does it mean?)
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// Linking the stylesheet to the app.js file
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// We "seed" the database, or remove existing campgrounds and
// add in new ones
// seedDB();

// PASSPORT CONFIGURATION
// Starting an express session (see the user authentication file to know what
// these all mean)
app.use(require("express-session")({
	secret: "Alap is a good brother",
	resave: false,
	saveUninitialized: false
}));

// See the authentication demo to see what these all mean
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Here is an example of a middleware that we can call to run on all the routes
// We are passing a variable of CurrentUser, with value req.user to all the routes
// on the template. Then, once its passed, we move on to the actual code of the body
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Now we simply have to say to use the routes from each of the corresponding files

// We can shorten the routes within the route files, by passing in routes
// common to all of them here.
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(3000, function() {
	console.log("YelpCamp Server has started");
});







