const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("errorMessage", " you dont have permission to access this page");
  res.redirect("/api/v1/users/login");
};
module.exports = isAuth;
