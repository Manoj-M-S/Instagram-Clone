//importing REQUIRED DEPENDECIES
const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ error: error.array()[0].msg });
  }
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        fullname: req.body.fullname,
        password: hash,
        role: req.body.role,
        photo: req.body.photo,
      });
      user.save((error, user) => {
        if (error) {
          return res.send(400).json({
            error: "User not saved",
          });
        }
        else{
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.cookie("token", token, { expire: new Date() + 9999 });
        const { _id, name, email, fullname, photo } = user;
        return res.json({
          token,
          user: { _id, name, email, fullname, photo },
        });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).json({ error: error.array()[0].msg });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "Email does not exists",
      });
    }
    bcrypt.compare(password, user.password).then((result) => {
      if (!result) {
        return res.status(401).json({
          error: "Email and Password do not match",
        });
      }
      if (result) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.cookie("token", token, { expire: new Date() + 9999 });
        const { _id, name, email, role, photo } = user;
        return res.json({
          token,
          user: { _id, name, email, role, photo },
        });
      }
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User logged out" });
};
