var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
var camp = require("./models/campground");
var Comment   = require("./models/comment");
var passport = require("passport");
var passportLocal = require("passport-local");
var expressSession = require("express-session");
var User = require("./models/user");
var seedDB = require("./seeds");
var methodOverride = require("method-override");

app.use(methodOverride("_method"));


var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

//seedDB();

mongoose.connect("mongodb://localhost/camps", { useNewUrlParser: true,useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.use(require("express-session")({
	secret: "This is secret sentence that is used to code password",
	resave: false,
	saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
	res.locals.currentUser = req.user;
	next();
})

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);


app.listen(3000,()=>{
	console.log("server started");
});