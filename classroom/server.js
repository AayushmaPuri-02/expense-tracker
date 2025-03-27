const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const posts = require ("./routes/post.js");
const users = require ("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require ("path");
app.set("view engine", "ejs");  // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set views folder


const sessionOptions = {
    secret : " mysupersecretstring" , 
    resave : false, 
    saveUninitialized : true
}
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = apple } = req.query;
    req.session.name = name;
    
    if(name === "apple"){
        req.flash("error", "user not registered no name given");
    }else{
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});
app.get("/hello", (req,res)=>{
    res.render("page.ejs", {name : req.session.name });
})

app.listen(8080, ()=>{
    console.log(`listening on port 8080`);

})
// app.get("/reqcount", (req,res)=>{
//     if(req.session.count ){
//         req.session.count ++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a req ${req.session.count }  times`);
// })

app.get("/test", (req,res)=>{
    res.send("test sucessful");
})


// app.use(cookieParser("secretcode"));
// app.use("/posts",posts);
// app.use("/users",users);

// app.get("/getsignedcookie", (req,res)=>{
//     res.cookie("made-in","Nepal",{signed : true});
//     res.send("signed cookie send");
// })
// app.get("/verify", (req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });
// app.get("/getcookiees", (req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("madeIn","hIndiello");
//     res.send("sent you some cookies");
// })

// app.get("/greet", (req,res)=>{
//     let {name= "anoynomus"} = req.cookies;
//     res.send(`Hi ${name}`);
// })
// app.get("/", (req,res)=>{

//     console.dir(req.cookies);
//     res.send("server is listening on port 8080");
// })

