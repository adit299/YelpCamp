const mongoose = require("mongoose");
 
const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        // We want to add a feature that allows users that have already logged in
        // to have their author fields already filled in when adding comments

        // Each comment will have a pointer to the ObjectID of the user that made
        // the comment

        // It will also contain a username string
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
 
module.exports = mongoose.model("Comment", commentSchema);
