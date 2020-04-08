var mongoose = require("mongoose");
var campSchema = mongoose.Schema({
	name: String,
	photo: String,
	descriptions: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});


module.exports = mongoose.model("camp",campSchema);
