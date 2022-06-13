const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    firstName: {
      type: String,
      required : true
    },
    lastName: {
      type: String,
      required : true
    },
    userName: {
      type: String,
      required : true
    },
    emailId: {
      type: String,
      required : true
    },
    password: {
      type: String,
      required : true
    },
  },
  { timestamps: true }
);

const pageUsers = mongoose.model("pageUsers", userSchema, "users");
module.exports = pageUsers;
