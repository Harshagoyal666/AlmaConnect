mongoose =require("mongoose");
var ReportSchema = new mongoose.Schema({
    heading: String,
    image: String,
    college: String,
    experience: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]

});
module.exports = mongoose.model("Report",ReportSchema);