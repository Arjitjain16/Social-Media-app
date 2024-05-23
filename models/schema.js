const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    profilepic : {
        type : String,
        default : "public/images/default-pic.jpg"

    },
    name: {
        type : String,
        trim: true,
        unique: true,
        required: [true, "Name is required"],
        minLength : [4, "name must be atleast 4 character"]
    },
    username: {
        type : String,
        trim: true,
        unique: true,
        required: [true, "userName is required"],
        minLength : [4, "username must be atleast 4 character long"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: String
}, {timestamps:true})


userSchema.plugin(plm)

const User = mongoose.model("user", userSchema)

module.exports = User;