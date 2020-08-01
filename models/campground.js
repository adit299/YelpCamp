const mongoose = require("mongoose");


// Schema Setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
	image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Setting up campground collection on database, and exporting it out of the file, so that we can
// import it on the app.js file
module.exports = mongoose.model("Campground", campgroundSchema);