const User = require('../models/userModel');
const Patient = require('../models/patientModel');

const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const { generateToken } = require('../config/jwtToken');
const {validateMongodbId} = require('../utils/validateMongoId');
const  {generateRefreshToken} = require('../config/refreshToken');


const registeruser = asyncHandler(async(req, res)=>{
  
    const {email, password, role} = req.body;

        try {

            superuser = await User.create(req.body);
            res.json(superuser).status(200);
            
        } catch (error) {

            throw new Error(error);
            
        }



});
const loginUser = asyncHandler(async(req, res)=>{

    const {email, password} = req.body;
console.log(req.body);

    try {
        const findone = await User.findOne({email:email});
        if(findone && await findone.isPasswordMatched(password))
    {
      const refreshtoken = await generateRefreshToken(findone?._id);
      const updateuser = await User.findByIdAndUpdate(
        findone._id,{
        refreshToken: refreshtoken
      },{
        new: true
      });
      res.cookie("refreshToken", refreshtoken,{
        sameSite:'None',
        secure: true,
        maxAge: 72*60*60*1000,
        httpOnly: true,
      });
      res.json({
        _id: findone?._id,
        firstname: findone?.firstname,
        lastname: findone?.lastname,
        email: findone?.email,
        mobile: findone?.mobile,
        role: findone?.role,
        refreshToken: generateToken(findone?._id)
      });     

    }else{
        throw new Error("Invalid Credentials");
    }
    } catch (error) {
        throw new Error(error);
    }
    


});

const logout = asyncHandler(async(req, res)=>{

    const {refreshToken} = req.body;
    //console.log(req.cookies);
    if(!refreshToken) throw new Error("No refresh Token in cookies");
    
    const user = await User.findOne({refreshToken}); 
    if(!user){
      
      return res.status(204) //forbidden
    }else{
      await User.findOneAndUpdate(refreshToken, {
      refreshToken: ""
    });
   
     res.status(204).json({logout: "logged out"}); //forbidden
    }  
    
      
   });

const addpatient = asyncHandler(async(req, res)=>{

})

const addgiver = asyncHandler(async(req, res)=>{

})
const editpatient = asyncHandler(async(req, res)=>{

})
const editgiver = asyncHandler(async(req, res)=>{

})
const getgiver = asyncHandler(async(req, res)=>{

})
const getpatient = asyncHandler(async(req, res)=>{

})

const allpatient = asyncHandler(async(req, res)=>{

})
const addapp = asyncHandler(async(req, res)=>{

})
const patientapps = asyncHandler(async(req, res)=>{

})
const patientappx = asyncHandler(async(req, res)=>{

})
const editpatientapp = asyncHandler(async(req, res)=>{

})

const addpay = asyncHandler(async(req, res)=>{

})

const getpay = asyncHandler(async(req, res)=>{

})
const patientpays = asyncHandler(async(req, res)=>{

})
const makepay = asyncHandler(async(req, res)=>{

})
const allpays = asyncHandler(async(req, res)=>{

})
  


module.exports = {registeruser, loginUser, profileUser, logout, addpatient, addgiver, editpatient, 
                 editgiver, getpatient, getgiver, allpatient, addapp, patientapps, patientappx, editpatientapp,
                  addpay, getpay, patientpays, makepay, allpays};