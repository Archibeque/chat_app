const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const isEmpty = require("is-empty");
const User = require("./users");
const router = express.Router();

// const signToken = userID => {
//     return jwt.sign({
//         iss: "nnadidan",
//         sub: userID
//     },"ready007")
// }







module.exports = router;


// User.findOne({ email }).then((user) => {
//     if (!user) {
//       return res.status(400).json({ emailnotfound: "Email not found" });
//     }
//     // check password
//     bcrypt.compare(password, user.password).then((isMatch) => {
//       if (isMatch) {
//         return done(null, user);
//         // user matched create jwt
//         const payload = {
//           id: user.id,
//           name: user.name,
//         };
//         // sign token
//         jwt.sign(
//           payload,
//           keys.secretOrKey,
//           { expiresIn: 31556926 },
//           (err, token) => {
//             res.json({ success: true, token: "Bearer" + token });
//           }
//         );
//       } else {
//         return res
//           .status(400)
//           .json({ passwordincorrect: "password incorrect" });
//       }
//     });
//   });