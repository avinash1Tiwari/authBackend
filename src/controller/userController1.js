const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { message } = require("telegraf/filters");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const {ServerConfig} = require('../config')

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("req.body")
    console.log(req.body)
    console.log("req.body")

    let existingUser;

    try {
      existingUser = await User.findOne({ email: email });
    } catch (error) 
    {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: "something went wrong while checking user details",
        message: error.message,
      });
    }
    console.log("ff");
    console.log(existingUser);

    if (existingUser) {
      console.log("f1f");
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: "user already exist corresponding to provided email, Login instead",
        message: "",
      });
    }

    // const hashedPassword = bcrypt.hashSync(password)

    const response = await User.create({
         username, 
         email, 
         password });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: "successfully sign up",
    });
  } 
  catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: "something went wrong",
      message: error.message,
    });
  }
};


const logIn = async (req,res) =>{
    
  const {email,password} = req.body;

  let existingUser;
  try{

      existingUser = await User.findOne({email:email})
  }
  catch(error){
      return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          data: "something went wrong",
          message: error.message,
      })

  }
  if(!existingUser)
      {
          return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              data: "User not found . Please SignUp !!",
              message: "",
          })
      }

      const isPasswordMatch = bcrypt.compareSync(password,existingUser.password)
      
      if(!isPasswordMatch)
          {
              return res.status(StatusCodes.BAD_REQUEST).json({
                  success: false,
                  data: "Invalid Email/password",
                  message: "",
              })
          }

          const token = jwt.sign({id:existingUser._id , email:existingUser.email} ,ServerConfig.SECRETE_KEY,{expiresIn:ServerConfig.JWT_EXPIRE_TIME} )


          return res.status(StatusCodes.OK).json({
              success: false,
              data: "Successfully Logged In !!",
              message: "",
              user:existingUser,
              token : token,
              expiresIn : ServerConfig.JWT_EXPIRE_TIME
          },
      
  )

}



// 1. verify token by accessing token from fontend from bearer-token,authorisation-part.

const verifyToken = async (req,res,next) =>{

  const headers = req.headers['authorization'];

  const token = headers.split(" ")[1];

  if(!token)
    {
      res.status(404).json({
        success : false,
        message : "Token not presnt"
      })
    }

    // if token present => verify it with jwt
    jwt.verify(String(token),ServerConfig.SECRETE_KEY,(err,user)=>{
      if(err){
        return res.status(404).json({
          success : false,
          error : new Error(err)
        })
      }

      req.id = user.id;

      // calling next middleware
      next()
    })
}



const getUser = async (req,res)=>{

  // console.log(req._id)

  const userId = req.id;
  console.log("userId")
  console.log(userId)
  let user;
  try{

     user = await User.findById(userId,"-password");
  }
  catch(error){
    return res.status(404).json({
      success : false,
      message :"Something went wrong while fetching user-details",
      error : new Error(error)
    })
  }

  if(!user){
    return res.status(404).json({
      message : "User not Found"
    })
  }

  return res.status(200).json({
    success : true,
    data : user
  })
}

module.exports = {
  signUp,
  logIn,
  verifyToken,
  getUser
};
