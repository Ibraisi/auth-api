const express = require("express");
const router = express.Router();
const PageUsers = require("../model/pageUsers");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const isAuth = require("../config/auth");
const pageUsers = require("../model/pageUsers");


//login page
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/v1/dashboard",
    failureRedirect: "/api/v1/users/login",
    failureFlash: true,
  })
);
//register page
router.get("/register", (req, res) => {
  res.render("register");
});

//register api
router.post("/register", (req, res) => {
  console.log(req.body);
  const { firstName, lastName, userName, emailId, password, password2 } =
    req.body;
  let errors = [];
  // checking if user entered all fields
  if (
    !firstName ||
    !lastName ||
    !userName ||
    !emailId ||
    !password ||
    !password2
  ) {
    //some wornings msgs
    errors.push({
      msg: "please enter all fields!",
    });
  }
  if (password !== password2) {
    errors.push({
      msg: "password does not match!",
    });
  }
  if (password.length < 3) {
    errors.push({
      msg: "Too short password",
    });
  }
  if (errors.length > 0) {
    res.render("register", { errors });
    // all good -> creating user if email not already existed
  } else {
    PageUsers.findOne({ emailId: emailId }, (err, user) => {
      if (user) {
        errors.push({
          msg: "Email areadly exist!",
        });
        res.render("register", { errors });
      } else {
        const newUser = new PageUsers({
          firstName,
          lastName,
          userName,
          emailId,
          password,
        });
        // bcryptying password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // saving user then redirecting to login page
            newUser
              .save()
              .then((user) => {
                console.log("user created");
                req.flash(
                  "successMessage",
                  " your account is created ,please login"
                );
                res.redirect("/api/v1/users/login");
              })
              // if user could not be saved redirecting to register page again
              .catch((err) => {
                console.log(err);
                req.flash("ErrorMessage", "There an error");
                res.redirect("/api/v1/users/register");
              }); //end new user
          });
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/api/v1/");
  });
});


router.post('/me', isAuth,  (req, res,next) => {
  try {
    const  userId  = req.user._id;
    console.log(userId)
    const user =  pageUsers.findById({ _id: userId });
    console.log(user)
    if(user){
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        pageUsers.deleteOne({ _id: userId }, (err)=> {
          if (err) {
                 console.log(err)
          }
          else {
            console.log("user removed")
            res.redirect("/api/v1/")
          }
      });
      });
    }
  } catch (err) {
    console.log(err)
    res.redirect("/api/v1/dashboard")
  }
});     

module.exports = router;
