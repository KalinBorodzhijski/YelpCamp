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
							req.flash("success","Comment added");
							res.redirect("/campgrounds/"+req.params.id);
						}
					});
				}
				
			})
		}
	});
});

routes.get("/campgrounds/:id/comments/:comment_id/edit",checkAccountOwnership,(req,res)=> {
	Comment.findById(req.params.comment_id,(err,element) => {
		if(err){
			res.redirect("back");
		}
		else{
			res.render("commentEditForm", {comment: element, campgroundId : req.params.id});
		}
	})
	
})

routes.put("/campgrounds/:id/comments/:comment_id",checkAccountOwnership,(req,res) => {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,elemet) => {
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})

})

routes.delete("/campgrounds/:id/comments/:comment_id",checkAccountOwnership,(req,res)=> {
	Comment.findByIdAndRemove(req.params.comment_id,(err,element) => {
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}

	})
})


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that!!!");
	res.redirect("/login");

}
function checkAccountOwnership(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,element) => {
			if(err){
				req.flash("error","Error with the database");
				res.redirect("back");
			}
			if(element.author.id.equals(req.user._id)){
				next();
			}
			else{
				req.flash("error","Permission Denied");
				res.redirect("back");
			}
		})
	}
	else {
		req.flash("error","You need to be logged in to do that!!!");
		res.redirect("back");
	}
}


module.exports = routes;
