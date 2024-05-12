var express = require('express');
var router = express.Router();
var User = require("../models/schema")
const passport = require("passport")
const LocalStrategy = require("passport-local")

passport.use(new LocalStrategy(User.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.user});
});

// register route
router.get('/register', function(req, res, next) {
  res.render('register', {user: req.user});
});

router.post("/register-user", async function(req, res){
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

//login
router.get('/login', function(req, res, next) {
  res.render('login', {user: req.user});
});

router.post("/login-user", passport.authenticate("local",
{successRedirect : "/profile", failureRedirect : "/login"}), 
function(req, res, next) {}
)


//logout

router.get("/logout-user", function(req, res, next){
  req.logout(() =>{
    res.redirect("/login")
  })
})

// profile
router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile', {user: req.user});
});

// user update 
router.get("/update-user/:id", function(req, res, next){
  res.render("userupdate" , {user: req.user})
})

router.get('/about', function(req, res, next) {
  res.render('about', {user: req.user});
});


function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/login")
  }
}
module.exports = router;
