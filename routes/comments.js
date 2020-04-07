var express = require("express");
var routes = express.Router();

var camp = require("../models/campground");
var Comment = require("../models/comment");


routes.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res) => {
	camp.findById(req.params.id,(err,foundCamp) => {
		if(err){
			console.log(err);
		}
		else {
			res.render("newComment",{camp: foundCamp});
		}
	})
	
});
routes.post("/campgrounds/:id/comments",isLoggedIn,(req,res) => {
	camp.findById(req.params.id,(err,foundUser) => {
		if(err){
			console.log(err);
		}else {
			Comment.create(req.body.comment,(err,newComment) => {
				if(err){
					console.log(err);
				}else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;  
                    newComment.save();
					foundUser.comments.push(newComment);
					foundUser.save((err) => {
						if(err){
							console.log(err);
						}else {
							res.redirect("/campgrounds/"+req.params.id);
						}
					});
				}
				
			})
		}
	});
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");

}

module.exports = routes;
