var express = require('express');
var router = express.Router();
var User = require("../models/schema")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const fs = require("fs");
const path = require('path');
const upload = require('../Utils/multer');


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
router.get("/update-user/:id", isLoggedIn, function(req, res, next){
  res.render("userupdate" , {user: req.user})
})

// reset password 

router.get("/reset-password/:id", isLoggedIn, function (req, res, next) {
  res.render("userresetpassword", { user: req.user });
});
router.post("/reset-password/:id", isLoggedIn, async function (req, res, next) {
  try {
      await req.user.changePassword(
        req.body.oldpassword,
        req.body.newpassword
      );
      req.user.save();
      res.redirect(`/update-user/${req.user._id}`);
  }catch (error) {
      res.send(error);
  }
});

// multer file upload 
// router.post("/image/:id", isLoggedIn, upload, async function(req , res, next){
//   try {
//     if(req.user.profilepic !== "default.jpg"){
//       fs.unlinkSync(path.join(__dirname, "..", "public", "images", req.user.profilepic))
//     }
//     req.user.profilepic = req.file.filename
//     await req.user.save()
//     res.redirect(`/update-user/${req.params.id}`);
//   } catch (error) {
//     res.send(error)
//   }
// })

router.post("/image/:id", isLoggedIn, upload.single('profilepic'), async function (req, res, next) {
  console.log("Upload request received");
  try {
    if (req.user.profilepic !== "default.png") {
      fs.unlinkSync(
          path.join(
              __dirname,
              "..",
              "public",
              "images",
              req.user.profilepic
          )
      );
  }

    // Save the new profile picture filename
    req.user.profilepic = req.file.filename;
    console.log("Uploaded file: ", req.file.filename);
    await req.user.save();

    res.send("Profile picture updated successfully");
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("An error occurred while uploading the profile picture");
  }
});


// delete user

router.get("/delete-user/:id", isLoggedIn, async function (req, res, next) {
  try {
      const deleteuser = await User.findByIdAndDelete(req.params.id);

       if (deleteuser.profilepic !== "default.png") {
           fs.unlinkSync(
               path.join(
                   __dirname,
                   "..",
                   "public",
                   "images",
                   deleteuser.profilepic
               )
           );
       }

      res.redirect("/login");
  } catch (error) {
      res.send(error);
  }
});



// FORGET PASSWORD 

router.get('/forget-email', function(req, res, next) {
  res.render('userforgetemail', {user: req.user});
});

router.post('/forget-email', async function(req, res, next) {

  try {
    const user = await User.findOne({email : req.body.email})
    if(user){
      res.redirect(`/forget-password/${user._id}`)
    }
    else{
      res.redirect("/forget-email")
    }
  } catch (error) {
    console.log(error);
  }
  
});

// forgot password 

router.get('/forget-password/:id', function(req, res, next) {
  res.render('userforgetpassword', {user: req.user, id: req.params.id});
});
router.post('/forget-password/:id', async function(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    await user.setPassword(req.body.password)
    await user.save()
    res.redirect('/login')
  } catch (error) {
    console.log(error);
  }
});

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
