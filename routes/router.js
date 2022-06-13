const express = require("express");
const router = express.Router();
const isAuth = require("../config/auth");
//dashboard
router.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

//home page
router.get("/", (req, res) => {
  res.render("home");
});

//dashboard

module.exports = router;
