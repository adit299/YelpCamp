// all the middleware goes here
// Alternate syntax would be to define these functions inside the curly braces
// or simply put the functions inside of the module.exports statement
const Campground = require("../models/campground"),
      Comment = require("../models/comments"),
      middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                res.redirect("back")
            }
            else {
                // does user own the campground?
                // We compare if the user id and author id matches between the currently
                // logged in user and the author of the campground

                // Another thing to note is that although the ids of these two look the same,
                // they are not actually identical. foundCampground.author.id is a mongoose 
                // object, while req.user._id is a string

                // To sidestep this, we can use a method that mongoose supplies to us to check
                // if the two strings are equal
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    } else {
        // back refers to the webpage the user was on previously
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                req.flash("error", "Campground not found")
                res.redirect("back")
            }
            else {
                // does user own the campground?
                // We compare if the user id and author id matches between the currently
                // logged in user and the author of the campground

                // Another thing to note is that although the ids of these two look the same,
                // they are not actually identical. foundCampground.author.id is a mongoose 
                // object, while req.user._id is a string

                // To sidestep this, we can use a method that mongoose supplies to us to check
                // if the two strings are equal
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You do not have permission to edit this campground")
                    res.redirect("back");
                }
            }
        });
    } else {
        // back refers to the webpage the user was on previously
        req.flash("error", "Nice try, but you need to be logged in to complete that operation");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    // Note that this does not automatically ensure that this message will be flashed
    // after accessing the route. It simply gives us a way of accessing the message,
    // we still need to handle it properly in the respective route
    req.flash("error", "You need to be logged in to complete that operation");
    res.redirect("/login");  
}


module.exports = middlewareObj;







