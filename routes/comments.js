var express =require("express");
var router = express.Router({mergeParams: true});
var Report =require("../models/Report");
var Comment =require("../models/comment");
var middleware =require("../middleware");
//comments new
router.get("/new",  middleware.isLoggedIn, function(req, res){
    //find Report by id
    Report.findById(req.params.id, function(err, Report){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {Report: Report});
        }
    })
   
});
//comments create
router.post("/", middleware.isLoggedIn,function(req, res){
    //lookup Report using id
    //create new Report
    //connect new comment to Report
    //redirect to Report show page
    Report.findById(req.params.id, function(err, Report){
        if(err){
            console.log(err);
            res.redirect("/Reports");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id= req.user._id;
                    comment.author.username =req.user.username;
                    comment.save();
                    //save comment
                    Report.comments.push(comment);
                    Report.save();
                    req.flash("success","successfully added comment");
                    res.redirect('/Reports/' + Report._id);
                }
            })
            
        }
    });

});
//comments edit route
router.get("/:comment_id/edit",middleware.CheckCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            res.render("comments/edit",{Report_id:req.params.id,comment:foundComment});
        }
    });
    
});
//comment update
router.put("/:comment_id",middleware.CheckCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
      if(err){
          res.redirect("back");
      }else{
          res.redirect("/Reports/"+req.params.id);
      }
  })
});
//comments destroy route
router.delete("/:comment_id",middleware.CheckCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");

        }else{
            req.flash("success","Comment deleted");
            res.redirect("/Reports/"+req.params.id);
        }
    });
});

module.exports = router;