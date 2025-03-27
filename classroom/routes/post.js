
const express = require("express");
// const app = express();
const router = express.Router();

//POSTS
//INDEX
router.get("/", (req,res)=>{
    res.send("GET for posts");
})
//SHOW ROUTE
router.get("/:id", (req,res)=>{
    res.send("GET for show  posts");
})
//POST ROUTE
router.post("/", (req,res)=>{
    res.send("POST route for post");
})
//DELETE ROUTE
router.delete("/:id", (req,res)=>{
    res.send("DELETE for posts");
})

module.exports = router;