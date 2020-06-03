var express =require("express");
var router = express.Router();
var Report=require("../models/Report");
var middleware =require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dyr60gr3z', 
  api_key: 979884417717411, 
  api_secret: 'rIPNWzKCcc4WIp6dpylqlr-Q2CY'
});
router.get("/",function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search),'gi');
        var noMatch;
        Report.find({college: regex},function(err,allReports)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                var noMatch="";
                if(allReports.length<1)
                {
                    noMatch="No posts are currently available from this college";
                }
                res.render("Reports/index",{Reports:allReports, noMatch:noMatch});
            }
            });
    }else{
        Report.find({},function(err,allReports)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                res.render("Reports/index",{Reports:allReports,noMatch:noMatch});
            }
            });
    }
});
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the Report object under image property
        req.body.Report.image = result.secure_url;
        // add author to Report
        req.body.Report.author = {
          id: req.user._id,
          username: req.user.username
        }
        Report.create(req.body.Report, function(err, Report) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/Reports/' + Report.id);
        });
      });
});
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("Reports/new");
})
router.get("/:id",function(req,res){
    Report.findById(req.params.id).populate("comments").exec(function(err,foundReport){
if(err)
{
    console.log(err)

}
else{
    res.render("Reports/show",{Report:foundReport});
}
    });
});
//edit Report route
router.get("/:id/edit",middleware.CheckReportOwnership, function(req,res){
        
        Report.findById(req.params.id,function(err, foundReport){
        res.render("Reports/edit",{Report: foundReport});
               
        });

});
//update Report route
router.put("/:id",middleware.CheckReportOwnership,function(req,res){
    Report.findByIdAndUpdate(req.params.id,req.body.Report,function(err, updateReport){
        if(err){
            res.redirect("/Reports");

        }else{
            res.redirect("/Reports/"+req.params.id);
        }
    });
});
// destroy Report route
router.delete("/:id",middleware.CheckReportOwnership,function(req,res){
Report.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/Reports");
    }else{
        req.flash("success","Report deleted");
        res.redirect("/Reports");
    }
});
});
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports=router;