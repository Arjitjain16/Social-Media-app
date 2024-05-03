var express = require('express');
var router = express.Router();
var User = require("../models/schema")
const passport = require("passport")
const LocalStrategy = require("passport-local")

passport.use(new LocalStrategy(User.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// register route
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post("/sign-user", async function(req, res){
  try {
    // const users = User(req.body)
    // await users.save()

    const {username, email, name, password} = req.body
    await User.register({name, username, email}, password)
    res.redirect("/login")
  } catch (error) {
    res.send(error);
  }
})

router.get('/login', function(req, res, next) {
  res.render('login');
});

// profile
router.get('/profile', function(req, res, next) {
  res.render('profile');
});


router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
