const { model } = require("mongoose");
const validator= require("validator");

const validateSignUpdata=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    }
    else if(firstName.length<4 && firstName.length>50){
        throw new Error("firstName must be between 4-50 characters ");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("password is not strong");
        
    }
}

module.exports={
    validateSignUpdata
};