
const mongoose = require("mongoose");
const validator=require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email not valid "+value);
                
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not strong "+value);
                
            }
        }

    },
    age: {
        type: Number,
        minLength: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new url("invalid url")
            }
        }
    },
    about: {
        type: String,
        default: "this is default description of user"
    },
    skills: {
        type: [String]
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;