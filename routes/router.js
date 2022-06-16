const express = require("express");
const router = express.Router();
const isAuth = require("../config/auth");
const pageUsers = require("../model/pageUsers");

//dashboard
router.get("/dashboard", isAuth, (req, res) => {
  console.log(pageUsers)
    res.render('dashboard', { userList : pageUsers });
});

//home page
router.get("/", (req, res) => {
  res.render("home");
});

//dashboard

module.exports = router;
