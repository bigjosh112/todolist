const express = require("express");
const dotenv = require("dotenv");
const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");


dotenv.config();

//enpoint to make a blog post
router.post('/post', async (req, res) => {
    //geting the parameter from request body
  const { token, title, user_id, tasks, description} = req.body;

  //checks
  if (!token || !tasks ) {
    return res.status(400).send({ status: "error", msg: "All fields must be filled" });
  }

  try {
      //time check
    const timestamp = Date.now();

    //console.log(process.env.JWT_SECRET);
    //verify token
    let user = jwt.verify(token, process.env.JWT_SECRET);

    //create the document 
    let post = new Post();
    post.title = title;
    post.description = description;
    post.tasks = tasks;
    post.timestamp = timestamp;

    //save to database
    post = await post.save();

    // increment post count
    user = await User.findOneAndUpdate(
        { _id: user_id },
        {
          $inc: { "stats.post_count": 1 },
        },
        { new: true }
      );
  
      console.log(user);
  
      return res.status(200).send({ status: "ok", msg: "Success", post });
    } catch (e) {

      console.log(e);

      return res.status(400).send({ status: "error", msg: "An error occured" });

    }
  });


  // endpoint to edit a todolist post
router.post("/edit_post", async (req, res) => {
  const { post_id, token, title, tasks, description } = req.body;

  // check for required fields
  if (!post_id || !token) {
    return res.status(400).send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    // token verification
    jwt.verify(token, process.env.JWT_SECRET);

    const timestamp = new Date();
    
    // check if document exists
    let post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).send({ status: "error", msg: "post not found" });
    }

    // update post document
    post = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        title: title || post.title,
        tasks: tasks || post.tasks,
        edited_at: timestamp,
        edited: true,
        description: description || post.description
      },
      { new: true }
    ).lean();

    return res.status(200).send({ status: "ok", msg: "Post edited successfully", post });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: "error", msg: "Some error occurred" });
  }
});

// endpoint to fetch all posts for a specific user
router.post("/all_specific_userpost", async (req, res) => {
  const { token, user_id } = req.body;
  
  //checks
  if (!token || !user_id )
    return res.status(400).send({ status: "error", msg: "All fields must be filled" });

  try {
    // token verification
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.find({ user_id: user_id })
      .select([ "title","tasks", "description" ])
      .lean();
    // console.log(post);

    return res.status(200).send({ status: "ok", msg: "Posts gotten successfully", post });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: "error", msg: "Some error occurred" });
  }
});

//endpoint to delete post
router.post('/delete', async (req, res) => {
  //getting parameter from request body
  const {post_id, token} = req.body;

  //checks
  if(!token || !post_id) 
   return res.status(400).send({status: 'error', msg: 'All field must be filled'})

   try {

    //delete the post found
    await Post.deleteOne({_id: post_id });

    return res.status(200).send({ status: "ok", msg: "delete successful" });

  } catch (e) {
    
    console.log(e)
    
    return res.status(400).send({ status: "error", msg: "Some error occured", e });
  }


}) 
  module.exports = router;