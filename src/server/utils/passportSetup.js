const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const passportSetup = function(passport) {

  // Configure facebook strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  }, function(accessToken, refreshToken, profile, done) {
    const userSearch = {
      "facebook.id": String(profile.id)
    };
    const userUpdate = {
      "facebook.displayName": String(profile.displayName),
      "cmene": String(profile.displayName),
      "login_type": "Facebook"
    };
    User.findOrCreate(userSearch, userUpdate, function(err, user) {
      if (err)
        throw err;
      return done(null, user);
    });
  }));

  // Configure twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  }, function(token, tokenSecret, profile, done) {
    console.log('in twitter callback');
    const userSearch = {
      "twitter.id": String(profile.id)
    };
    const userUpdate = {
      "twitter.displayName": String(profile.displayName),
      "cmene": String(profile.displayName),
      "login_type": "Twitter"
    };
    User.findOrCreate(userSearch, userUpdate, function(err, user) {
      if (err)
        throw err;
      return done(null, user);
    });
  }));

  // Configure google+ strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, function(token, tokenSecret, profile, done) {
    console.log('in google callback');
    const userSearch = {
      "google.id": String(profile.id)
    };
    const userUpdate = {
      "google.displayName": String(profile.displayName),
      "cmene": String(profile.displayName),
      "login_type": "Google"
    };
    User.findOrCreate(userSearch, userUpdate, function(err, user) {
      if (err)
        throw err;
      return done(null, user);
    });
  }));

  // Configure local-signup strategy
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    username: 'username',
    password: 'password'
    //passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(username, password, done) {
    const pilno = JSON.parse(username);
    function CheckEmail(pilno) {
      const Isemail = require('isemail');
      if (!pilno.email || !Isemail.validate(pilno.email))
        return false;
      return true;
    };
    User.findOne({
      $or: [
        {
          'local.username': pilno.cmene
        }, {
          'local.email': pilno.cmene
        }, {
          'local.email': pilno.email
        }
      ]
    }, function(err, user) {
      if (!CheckEmail(pilno)) {
        return done(null, false, {message: "bad email syntax"});
      }
      if (err)
        return done(err);
      if (user) {
        return done(null, false, {message: "nickname or email already registered"}); //username already exists
      } else {
        const newUser = new User();
        // set the user's local credentials
        newUser.local.username = pilno.cmene;
        newUser.local.email = pilno.email;
        newUser.local.password = newUser.generateHash(password);
        newUser.cmene = pilno.cmene;
        newUser.login_type = "local";

        // save the user
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  }));

  // Configure local-login strategy
  passport.use('local-login', new LocalStrategy(function(username, password, done) {
    User.findOne({
      'local.username': username
    }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
        return done(err);
      if (!user)
        return done(null, false, {message: "We couldn't find that username.."}); //no username found
      if (!user.validPassword(password))
        return done(null, false, {message: "Incorrect password.."}); //wrong password
      return done(null, user);
    });
  }));

  // Serialize functions for sessions
  passport.serializeUser(function(user, cb) {
    cb(null, user._id);
  });

  passport.deserializeUser(function(id, cb) {
    User.findById(id, function(err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};

module.exports = passportSetup;
