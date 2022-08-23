const express = require("express");
const router = express.Router();
const User = require("../users");
const bcrypt = require("bcryptjs");

class error {
  constructor() {
    this.count = 0;
    this.lowesCount = 0;
    this.items = {};
  }

  enqueue(element) {
    this.items[this.count] = element;
    this.count++;
  }
}

// // auth
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;

  // const errors = []
  const errors = new error();

  if (!name || !email || !password || !password2) {
    JSON.stringify(errors.enqueue({ msg: "please fill in all fields" }));
  }
  if (password.length < 6) {
    JSON.stringify(
      errors.enqueue({
        msg: "please ensure password is greater than 6 characters",
      })
    );
  }
  if (password !== password2) {
    JSON.stringify(errors.enqueue({ msg: "passwords do not match" }));
  }

  if (errors.count > 0) {
    // res.render('index', { errors })
    // var displayError = Object.assign({}, errors)
    res.status(400).json(errors);
    console.log(errors);
  } else {
    // User.find({name: name})
    // .then(user => {
    //     if(user) {
    //         errors.enqueue({msg: 'Name is already registered'})
    //         // res.render('index', {errors	})
    //         // var displayError = Object.assign({}, ...errors)
    //         res.status(400).json(errors)
    //         console.log(errors)

    //       }
    // }),
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          errors.enqueue({ msg: "Email is already registered" });
          // res.render('index', {errors	})
          // var displayError = Object.assign({}, ...errors)
          res.status(400).json(errors);
          console.log(errors);
        } else {
          const newUser = new User({
            name,
            email,
            password,
            photo: "",
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  //   res.redirect('/users/login')
                  res.status(201).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  });
                  console.log(user);
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    });
    console.log(user);
  } else {
    res.status(400).json("Invalid User");
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;

  // const errors = []
  const errors = new error();

  if (!name || !email || !password || !password2) {
    JSON.stringify(errors.enqueue({ msg: "please fill in all fields" }));
  }
  if (password.length < 6) {
    JSON.stringify(
      errors.enqueue({
        msg: "please ensure password is greater than 6 characters",
      })
    );
  }
  if (password !== password2) {
    JSON.stringify(errors.enqueue({ msg: "passwords do not match" }));
  }

  if (errors.count > 0) {
    // res.render('index', { errors })
    // var displayError = Object.assign({}, errors)
    res.status(400).json(errors);
    console.log(errors);
  } else {
    // User.find({name: name})
    // .then(user => {
    //     if(user) {
    //         errors.enqueue({msg: 'Name is already registered'})
    //         // res.render('index', {errors	})
    //         // var displayError = Object.assign({}, ...errors)
    //         res.status(400).json(errors)
    //         console.log(errors)

    //       }
    // }),
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          errors.enqueue({ msg: "Email is already registered" });
          // res.render('index', {errors	})
          // var displayError = Object.assign({}, ...errors)
          res.status(400).json(errors);
          console.log(errors);
        } else {
          const newUser = new User({
            name,
            email,
            password,
            photo: "",
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  //   res.redirect('/users/login')
                  res.status(201).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  });
                  console.log(user);
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
