const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  session = require("express-session"),
  moment = require("moment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  User = require("./models/user");


// requiring routes     
const indexRoute = require("./routes/index");

//this is used to run on local server ie., locsalhost:3000
let url = process.env.DATABASEURL || "mongodb://localhost/hostel";
mongoose.connect(url, { useNewUrlParser: true });

// connect to the DB on mlab
// const databaseUri = 'mongodb://abdul:wasey1@ds149914.mlab.com:49914/hostel';
// mongoose.connect(databaseUri,{ useNewUrlParser: true })
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment; // create local variable available for the application

//passport configuration
app.use(session({
  secret: 'abcd',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// use routes
app.use("/", indexRoute);

app.listen((process.env.PORT || 3000), function () {
  console.log("The Server Has Started!");
});
