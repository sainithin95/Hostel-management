const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Kitchen = require("../models/kitchen"),
    Student = require("../models/student"),
    Feedback = require("../models/feedback"),
    Attendance = require("../models/attendance"),
    Room = require("../models/room"),
    middleware = require("../middleware"),
    Gate = require("../models/gatepass");
var mongoose = require("mongoose");
// root route
router.get('/', (req, res) => res.render("home"));


router.get('/list', middleware.isLoggedIn, (req, res) => {
    Kitchen.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("kitchen", { list: list });
        }
    });
});


router.get("/add", middleware.isLoggedIn, (req, res) => res.render("add"));
// handle sign up logic
router.post("/add", middleware.isLoggedIn, (req, res) => {

    var item = req.body.item;
    var amount = req.body.amount;
    var quantity = req.body.quantity;
    var unit = req.body.unit;
    var price = req.body.price;
    var category = req.body.category;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newItem = { item: item, amount: amount, quantity: quantity, unit: unit, price: price, category: category, author: author }
    Kitchen.create(newItem, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newItem.item + " is successfully added");
            res.redirect("/");
        }
    })
});

router.get("/:id/edit", middleware.isLoggedIn, function (req, res) {
    Kitchen.findById(req.params.id, function (err, foundItem) {
        res.render("edit", { item: foundItem });
    });
});

router.put("/:id", middleware.isLoggedIn, function (req, res) {
    var item = req.body.item;
    var amount = req.body.amount;
    var quantity = req.body.quantity;
    var unit = req.body.unit;
    var price = req.body.price;
    var category = req.body.category;
    var newItem = { item: item, amount: amount, quantity: quantity, unit: unit, price: price, category: category }
    Kitchen.findByIdAndUpdate(req.params.id, newItem, function (err, updatedItem) {
        if (err) {
            console.log(err);
            res.redirect("/list");
        } else {
            //redirect somewhere(show page)
            console.log(updatedItem);
            res.redirect("/list");
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, function (req, res) {
    Kitchen.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/list");
        } else {
            res.redirect("/list");
        }
    });
});

router.get("/feedback", (req, res) => res.render("feedback"));


router.post("/feedback", (req, res) => {

    var names = req.body.names;
    var phones = req.body.phone;
    var email = req.body.email;
    var texts = req.body.texts;
    var newFeedback = { names: names, Phone: phones, email: email, feedback: texts }
    Feedback.create(newFeedback, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newFeedback.names + " Thankyou for submitting feedback!!");
            res.redirect("/");
        }
    })
});


router.get('/feedbacklist', middleware.isLoggedIn, (req, res) => {
    Feedback.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("feedbacklist", { list: list });
        }
    });
});

router.get("/register", (req, res) => res.render("register"));
// handle sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email
    });

    if (req.body.adminCode == 8080) {
        newUser.isAdmin = true;
    }
    else if (req.body.adminCode == 9090) {
        newUser.isChef = true;
    }
    else if (req.body.adminCode == 7070) {
        newUser.isWarden = true;
    }
    else {
        req.flash("error", "Entered Wrong code contact Administrator");
        return res.redirect("/register");
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            if (err.email === 'MongoError' && err.code === 11000) {
                // Duplicate email
                req.flash("error", "That email has already been registered.");
                return res.redirect("/register");
            }
            // Some other error
            req.flash("error", "Something went wrong...");
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome  " + user.username);
            res.redirect("/");
        });
    });
});


// show login form
router.get("/login", (req, res) => res.render("login", { page: "login" }));

// login logic: app.post("/login", middleware, callback)
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect('/login');
        }
        req.logIn(user, err => {
            if (err) { return next(err); }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            req.flash("success", "Good to see you again, " + user.username);
            res.redirect(redirectTo);
        });
    })(req, res, next);
});

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully. Looking forward to seeing you again!");
    res.redirect("/");
});

router.get("/addroom", middleware.isLoggedIn, (req, res) => res.render("addRoom"));

router.post("/addroom", middleware.isLoggedIn, (req, res) => {

    var room = req.body.roomn;
    var ac = req.body.ac;
    var limit = req.body.limit;

    var newRoom = { ac: ac, room: room, limit: limit }
    Room.create(newRoom, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newRoom.room + " is successfully added");
            res.redirect("/addroom");
        }
    })
});

router.get('/addstudent', middleware.isLoggedIn, (req, res) => {
    Room.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("addStudent", { list: list });
        }
    });
});

router.post("/addstudent", middleware.isLoggedIn, (req, res) => {

    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var room = req.body.room;
    var roll = req.body.roll;

    var newStudent = { username: name, name: name, email: email, phone: phone, room: room, roll: roll }
    Student.create(newStudent, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newStudent.name + " is successfully added");
            Room.findByIdAndUpdate(req.body.room).exec(function (err, list) {
                if (err) { console.log(err); }
                else {
                    console.log(list);
                    list.student.push(name);
                    console.log(list);
                    list.save();
                    res.redirect("/addstudent");
                }
            })
        }
    })
});



router.get("/gatepass", middleware.isLoggedIn, (req, res) => res.render("gatepass"));


router.post("/request", middleware.isLoggedIn, (req, res) => {

    var names = req.user.name;
    var Reason = req.body.texts;
    var newItem = { names: names, Reason: Reason }
    Gate.create(newItem, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", " Request successfully submitted, you will soon receive a mail regarding the status");
            res.redirect("/");
        }
    })
});



router.get("/approve", middleware.isLoggedIn, (req, res) => {

    Gate.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("approve", { list: list });
        }
    });
});


router.post("/:id/accept", middleware.isLoggedIn, function (req, res) {
    Gate.findByIdAndUpdate(req.params.id).exec(function (err, list) {
        if (err) {
            console.log(err);
        } else {
            list.Permission = 'true';
            list.Status = 'true';
            list.save();
            res.redirect("/approve");

        }
    })
});



router.post("/:id/reject", middleware.isLoggedIn, function (req, res) {
    Gate.findByIdAndUpdate(req.params.id).exec(function (err, list) {
        if (err) {
            console.log(err);
        } else {
            
            list.Permission = 'false';
            list.Status = 'true';
            list.save();
            res.redirect("/approve");

        }
    })
});


// security pass verification

router.get('/gatecheck', middleware.isLoggedIn, (req, res) => {
    Gate.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("gatecheck", { list: list });
        }
    });
});



router.delete("/:id/gatecheck", middleware.isLoggedIn, function (req, res) {
    Gate.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/gatecheck");
        } else {
            res.redirect("/gatecheck");
        }
    });
});



router.get('/attendance', middleware.isLoggedIn, (req, res) => {
    Room.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("addAttendance", { list: list });
        }
    });
});



router.post("/attendance", middleware.isLoggedIn, (req, res) => {


    var available = req.body.a;
    var name = req.body.name;
    var room = req.body.room;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newItem = { name: name, room: room, available: available, author: author }
    Attendance.create(newItem, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success Posted");
            res.redirect("/attendance");

        }
    })
});


router.get('/absent', middleware.isLoggedIn, (req, res) => {
    Attendance.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("absent", { list: list });
        }
    });
});



router.get('/showstudent', middleware.isLoggedIn, (req, res) => {
    Student.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("showstudent", { list: list });
        }
    });
});


router.get('/showrooms', middleware.isLoggedIn, (req, res) => {
    Room.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("showrooms", { list: list });
        }
    });
});


router.get("/post", middleware.isLoggedIn, (req, res) => res.render("post"));

router.post('/post', middleware.isLoggedIn, (req, res) => {

    Student.find({ room: req.body.room }, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("post", { list: list });
        }
    });
});


module.exports = router;