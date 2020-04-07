var express = require("express");
var routes = express.Router();
var camp = require("../models/campground");

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

routes.get("/campgrounds/new",(req,res) => {
	res.render("form");
})

routes.post("/campgrounds",(req,res) => {
	
	camp.create({
		name: req.body.name,
		photo: req.body.photo,
		descriptions: req.body.descriptions
	},(err,element) => {
		if(err){
			console.log("Error adding to the database");
			console.log(err);
		}
		
	});
	res.redirect("/campgrounds");
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

module.exports = routes;