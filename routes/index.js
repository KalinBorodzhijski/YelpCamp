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
			res.redirect("/");
		}
		passport.authenticate("local")(req,res,() => {
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
	req.flash("success","Logged you out");
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