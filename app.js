var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
var camp = require("./models/campground");
var seedDB = require("./seeds");
var Comment   = require("./models/comment");


//seedDB();

mongoose.connect("mongodb://localhost/camps", { useNewUrlParser: true,useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res) => {
	res.render("index");
})



app.get("/campgrounds",(req,res) => {
	camp.find({},(err,element) => {
		if(err){
			console.log("Error finding elements")
			console.log(err);
		}else{
			res.render("campgrounds",{campgrounds: element});
		}
	})
	
	
})

app.get("/campgrounds/new",(req,res) => {
	res.render("form");
})

app.post("/campgrounds",(req,res) => {
	
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
app.get("/campgrounds/:id",(req,res) => {

	camp.findById(req.params.id).populate("comments").exec((err,element) => {
		if(err){
			console.log(err);
		}
		else{
			
			res.render("show",{element: element});
		}

	});

});

app.get("/campgrounds/:id/comments/new",(req,res) => {
	res.render("newComment",{id: req.params.id});
});

app.post("/campgrounds/:id/comments",(req,res) => {
	camp.findById(req.params.id,(err,foundUser) => {
		if(err){
			console.log(err);
		}else {
			Comment.create({
				text: req.body.comment,
				author: "Peter"
			},(err,newComment) => {
				if(err){
					console.log(err);
				}else {
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


app.listen(3000,()=>{
	console.log("server started");
});