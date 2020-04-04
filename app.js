var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost/camps", { useNewUrlParser: true,useUnifiedTopology: true});

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));


var campSchema = mongoose.Schema({
	name: String,
	photo: String,
	descriptions: String
});

var camp = mongoose.model("camp",campSchema);


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

	camp.find({_id : req.params.id},(err,element) => {
		if(err){
			console.log(err);
		}
		else{
			
			res.render("show",{element: element[0]});
		}

	});

});


app.listen(3000,()=>{
	console.log("server started");
});