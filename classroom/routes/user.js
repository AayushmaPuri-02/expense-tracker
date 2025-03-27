const express = require("express");
const router = express.Router();


//INDEX ROUTE
router.get("/", (req,res)=>{
    res.send("GET for users");
})
//SHOW ROUTE
router.get("/:id", (req,res)=>{
    res.send("GET for show  users");
})
//POST ROUTE
router.post("/", (req,res)=>{
    res.send("POST for show  users");
})
//DELETE ROUTE
router.delete("/:id", (req,res)=>{
    res.send("DELETE for show  users");
})
module.exports = router;
