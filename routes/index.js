// As opposed to adding the routes directly to the router, we have a router object, to which
// we add all the routes, and we directly export the router object to be utilized in app.js

const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");


router.get("/", function(req, res){
	res.render("landing");
});


// =========
// AUTH ROUTES
// =========

// Render the register form
router.get("/register", function(req, res){
	res.render("register");
});

// Handle the sign up logic (Post request to register)
router.post("/register", function(req, res){
	const newUser = new User({username: req.body.username});
	// Passport logic to create a new user
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			// Here we can take advantage of the passport.js err parameter
			// which has all the error messages already written out for us
			req.flash("error", err.message);
			// Before, we had a res.render, which is incorrect, we can either pass
			// in req.flash through to res.render or flash the error message and move
			// on to return res.render("register")
			// return res.render("register");
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			// We are displaying the username of the user being returned from the
			// database
			req.flash("success", "Welcome to YelpCamp " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

// Show the login form
router.get("/login", function(req, res){
	// Here we pass in the message that should be flashed when we go to login, and encounter
	// an error
	res.render("login");
});

// Handling login logic (POST request to login)
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login" 
	}), function(req, res){

});

// Logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged you out, have a nice day!");
	res.redirect("/campgrounds");
});


module.exports = router;

