


const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// const User = mongoose.model("users");
const keys = require("../config/keys");
// const opts = {};
// opts.
jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.
secretOrKey = "ready007"
module.exports = passport => {
  passport.use(
    new JwtStrategy((jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};





const localStrategy = require('passport-local').Strategy
// const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../users')


module.exports = function(passport) {
	passport.use(
		new localStrategy({usernameField: 'email'}, (email,password,done) =>{
			//match user using mongoose
			User.findOne({ email: email})
				.then(user =>{
					if (!user){
						return done(null, false, {message: 'That email is not registered' })
					}
		

					bcrypt.compare(password, user.password, (err, isMatch)=>{
						if(err) {
							console.log(err)
						}
						if(isMatch) {
							return done(null, user)
						}else{
							return done(null, false, {message: 'password is incorrect'})
						}
					})
                })
				.catch(err => console.log(err))
	}))

}


passport.serializeUser(function(user, done){
    done(null, user.id)
})


passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user)
    })
})