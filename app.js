require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var flash = require("connect-flash");
const express = require("express");
const app = express();
var exphbs = require("express-handlebars");
var session = require("express-session");
const passport = require("passport");

//config session and flash
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

require("./config/authConfig");
app.use(passport.initialize());
app.use(passport.session());
//flash messages config
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");

  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});
//bodyparser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db Con
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db"));
app.use(express.json());
//view engine config
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

//Routing for non-logged
app.use("/api/v1/", require("./routes/router"));
//Routing for logged
app.use("/api/v1/users", require("./routes/user"));
app.listen(5001, () => console.log("started"));
