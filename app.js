var express=require("express"),
    app=express(),
    bodyParser = require("body-parser"),
    mongoose =require("mongoose"),
    flash =require("connect-flash"),
    passport = require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride =require("method-override"),
    Report = require("./models/Report"),
    Comment = require("./models/comment"),
    User=require("./models/user"),
    seedDB = require("./seeds");

var commentRoutes =require("./routes/comments"),
    ReportRoutes = require("./routes/Reports"),
    indexRoutes =require("./routes/index")


//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
//mongo "mongodb+srv://cluster0-n8rtd.mongodb.net/test" --username Harsha
mongoose.connect('mongodb+srv://Harsha:Harsha@123@cluster0-svwfi.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useCreateIndex:true
});
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();//seed the database
    
//Pasport configuration
app.use(require("express-session")({
    secret: "Add new pics",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use("/",indexRoutes);
app.use("/Reports",ReportRoutes);
app.use("/Reports/:id/comments",commentRoutes);

app.listen(3000,process.env.IP,function(){
    console.log("The AlmaConnect server Has started!");
})