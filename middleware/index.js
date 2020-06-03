//all the middleware goes here
var Report=require("../models/Report");
var Comment=require("../models/comment");
var middlewareObj={};
middlewareObj.CheckReportOwnership=function(req,res,next){
    
        if(req.isAuthenticated()){
            Report.findById(req.params.id,function(err, foundReport){
                if(err){
                    req.flash("error","Report not found");
                    res.redirect("back")
                }else{
                    //does user own the Report?
                    if(foundReport.author.id.equals(req.user._id))
                    {next();}
                    else{
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
           
        } else{
            req.flash("error","You need to be logged in to that");
            res.redirect("back");
        
        
}
}
middlewareObj.CheckCommentOwnership=function(req,res,next){
    
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err, foundComment){
                if(err){
                    req.flash("error","Something went wrong");
                    res.redirect("back")
                }else{
                    //does user own the comment?
                    if(foundComment.author.id.equals(req.user._id))
                    {next();}
                    else{
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
           
        } else{
            req.flash("error","You need to be logged in to that");
            res.redirect("back");
        }
        
    }
middlewareObj.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to that");
    res.redirect("/login");
}
module.exports=middlewareObj