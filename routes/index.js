var express = require('express');
var router = express.Router();
var User = require("../models/schema")

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
    const users = User(req.body)
    await users.save()
    res.redirect("/login")
  } catch (error) {
    res.send(error);
  }
})

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
