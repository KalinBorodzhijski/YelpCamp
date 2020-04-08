var express = require("express");
var routes = express.Router();
var camp = require("../models/campground");
var Comment   = require("../models/comment");

routes.get("/campgrounds",(req,res) => {
	camp.find({},(err,element) => {
		if(err){
			console.log("Error finding elements")
			console.log(err);
		}else{
			res.render("campgrounds",{campgrounds: element});
		}
	})
})

routes.get("/campgrounds/new",isLoggedIn,(req,res) => {
	res.render("form");
})

routes.post("/campgrounds",isLoggedIn,(req,res) => {
	
	camp.create({
		name: req.body.name,
		photo: req.body.photo,
		descriptions: req.body.descriptions,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	},(err,element) => {
		if(err){
			console.log("Error adding to the database");
			console.log(err);
		}
		
		res.redirect("/campgrounds");
	});
	
})
routes.get("/campgrounds/:id",(req,res) => {

	camp.findById(req.params.id).populate("comments").exec((err,element) => {
		if(err){
			console.log(err);
		}
		else{
			
			res.render("show",{element: element});
		}

	});

});

routes.get("/campgrounds/:id/edit",checkAccountOwnership,(req,res)=>{

		camp.findById(req.params.id,(err,element) => {
			
			res.render("editForm",{campground: element});
			
		})
	
});

routes.put("/campgrounds/:id",checkAccountOwnership,(req,res)=> {
	camp.findByIdAndUpdate(req.params.id,req.body.update,(err,element)=> {
	
			res.redirect("/campgrounds/" + req.params.id);
		
	})

});

routes.delete("/campgrounds/:id",checkAccountOwnership,(req,res)=> {
	camp.findByIdAndDelete(req.params.id,(err,element)=>{
		Comment.deleteMany({_id: { $in: element.comments } });
		res.redirect("/campgrounds");
	})

});



function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");

}

function checkAccountOwnership(req,res,next){
	if(req.isAuthenticated()){
		camp.findById(req.params.id,(err,element) => {
			if(err){
				res.redirect("back");
			}
			if(element.author.id.equals(req.user._id)){
				next();
			}
			else{
				res.redirect("back"); 
			}
		})
	}
	else {
		res.redirect("back");
	}
}

module.exports = routes;