const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    Title : {
        type: String,
        required: true
    },
    Content : String,
    DateCreated : {
        type: Date,
        default : () => Date.now()
    }
});

module.exports = mongoose.model("Blog",blogSchema);

/**
 * Used to insert initial blog data
 * const addPosts = async() => {
    const blog1 = new Blog({Title:"Blog Post 1",Content:"This is my first blog post!"});
    await blog1.save();
    const blog2 = new Blog({Title:"Blog Post 2",Content:"MongoDB is fun to use!"});
    await blog2.save();
    const blog3 = new Blog({Title:"Blog Post 3",Content:"I implemented user authentication using NodeJS, Express, and MongoDB!"});
    await blog3.save();
    console.log("Posts Added");
    }
 */
