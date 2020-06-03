var mongoose = require("mongoose");
var Report = require("./models/Report");
var Comment = require("./models/comment");
var data = [
    {
        name: "Green Adventure Tent stay Wayanad",
        image: "https://r-cf.bstatic.com/images/hotel/max1280x900/196/196994700.jpg",
        description: "Located 24.1 km from Soochipara Falls, Green Adventure Tent stay Wayanad has accommodations with free WiFi and free private parking. A vegetarian breakfast is available each morning at the Report.Guests can also relax in the garden.The nearest airport is Calicut International Airport, 95 km from Green Adventure Tent stay Wayanad.b"
    },
    {
        name: "Cougar Rock Report",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/01/d9/bc/da/cougar-rock-Report.jpg",
        description: "Each of the three drive-in Reports within the borders of Mount Rainier National Park has its own special vibe, as well as its own unique attributes and features that set it apart. Cougar Rock Report is located in the southwest area of the park; the most-visited corner of the park on the road to Paradise, making it a convenient overnight stay for many visitors. With 173 individual sites and 5 group sites, along with a variety of nearby attractions, there is something here for just about everyone."
    }
]
function seedDB(){
    Report.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Report!");
        data.forEach(function(seed){
            Report.create(seed, function(err,Report){
                if(err){
                    console.log(err)
                }else{
                    console.log("added a Report");
                    // create a comment
                    Comment.create({text: "vfsvfsvbdfs", author: "harsha"},
                    function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            Report.comments.push(comment);
                            Report.save();
                            console.log("created new comment");}
                        

                    }
                    );

                }
            });
        });
    });
    
}
module.exports = seedDB;
