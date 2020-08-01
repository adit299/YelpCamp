const express = require("express"),
      router = express.Router(),
	  Campground = require("../models/campground"),
	//   Note that index.js is a special file name, if we require a directory, we will automatically
	// obtain index.js from that
	  middleware = require("../middleware");

// INDEX
router.get("/", function(req, res) {
	// As opposed to V1, we have to now retrieve our campgrounds from the database as opposed to an array
	// We used the find method, paired with blank parameters, to retrieve all the campgrounds
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			// So note that req.user will contain all the data about a user, if one is 
			// currently logged in.
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});
});

// CREATE

// REST Convention: Why is both the GET and POST request named /"campgrounds"? It is part of a convention known as REST
// which we will learn more about later on in the course. This route will allow us to add new campgrounds
router.post("/", middleware.isLoggedIn, function(req, res) {
	// From V1 to V2, we have to change this code so that now, we will add a new campground to the database,
	// as opposed to pushing to an array
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const desc = req.body.description;
	// Similar to comments in V8, we have added an association for campgrounds,
	// you need to be logged in, in order to add a new campground
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	const newCampground = {name: name, price: price, image: image, description: desc, author:author};

	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
		// redirect back to the campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW

// Rendering the form that makes it possible to add new campgrounds
// Remember that the body parser library that we added makes it possible for us
// to extract the data that we entered into the form
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW
// Adding a Description to each of our campgrounds

router.get("/:id", function(req, res) {
	// This is a new MongoDB method which lets us search for a particular 
	// campground by id. req.params.id lets us retrieve the id.
	// Recall, just like the blogs example, we call the populate function on "comments"
	// and execute this function, to populate the comments array with the actual comments
	// as opposed to just the references
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			// If the campground is found, we render the show page, and we
			// pass to it the found campground object 
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// To complete CRUD conventions, we need to add an edit page for campground and update page
// for campground (edit simply renders a page for the edits, and update actually applies those
// changes)

// EDIT CAMPGROUND ROUTE
// We are going to modify this so that only users who have logged in and are accessing campgrounds
// which they have created themselves, will be allowed to edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground})			
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}

	});
	// redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});




module.exports = router;

