var express = require("express");
var routes = express.Router();
var passport = require("passport");
var User = require("../models/user");

routes.get("/",(req,res) => {
	res.render("index");
})


routes.get("/register",(req,res) => {
	res.render("registerForm");
})

routes.post("/register",(req,res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password,(err,newUser) => {
		if(err){
			req.flash("error", err.message);
            return res.redirect('/register');
		}
		passport.authenticate("local")(req,res,() => {
			req.flash("success","Welcome to YelpCamp " + newUser.username);
			res.redirect("/campgrounds"); 
		})
	})

})

routes.get("/login",(req,res) => {
	res.render("loginForm");
})

routes.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}))


routes.get("/logout",(req,res) => {
	req.logOut();
	req.flash("success","You need to be logged in to do that!!!");
	res.redirect("/campgrounds")
})


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("success","Please Login First!");
	res.redirect("/login");

}
module.exports = routes;