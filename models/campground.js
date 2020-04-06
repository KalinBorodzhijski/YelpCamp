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
	]
});


module.exports = mongoose.model("camp",campSchema);
