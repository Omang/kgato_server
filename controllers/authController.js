const User = require('../models/userModel');
const Org = require('../models/orgModel');
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const { generateToken } = require('../config/jwtToken');
const {validateMongodbId} = require('../utils/validateMongoId');
const  {generateRefreshToken} = require('../config/refreshToken');
const Animal = require('../models/animalModel');

const Payment = require('../models/paidModel');


const addcode = asyncHandler(async(req, res)=>{
    const {code, fullname, duration} = req.body;

    try{

         const addnew = await Payment.create({
                code: code,
                fullname: fullname,
                duration: duration
            })
        if(addnew){

            res.json(addnew);

        }else{

            res.json({error: 'Saved Unsuccessfull..try again'});

        }

    }catch(e){
        throw new Error(e);
    }
})

const addpay = asyncHandler(async(code, fullname, duration)=>{
       try{

        const addnew = await Payment.create({
                code: code,
                fullname: fullname,
                duration: duration
            })
        if(addnew){
            return addnew;
        }else{
            return {dataone: "datanotsaved"};
        }
        
       }catch(e){
        return e;
       }
})
const checkcode = asyncHandler(async(req, res)=>{
    const {thecode, chipnum} = req.body;

    try{

        const mydata = await Payment.findOne({code: thecode});

        if(mydata){


         const getanimal = await Animal.findOne({animal_chip: chipnum});
         
          if(getanimal){

            res.json(getanimal);

          }else{

            res.json({sms:'animal not found'});

          }

          

        }else{
            res.json({notfound: 'not found'});
        }

    }catch(e){
        throw new Error(e);
    }
})

const registerSuperuser = asyncHandler(async(req, res)=>{
  
    const {firstname, lastname, 
        email, mobile, occupation, 
        password, role} = req.body;

        try {

            superuser = await User.create({firstname, lastname, 
                email, mobile, occupation, 
                password, role});
            res.json(superuser);
            
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
  
   const updateUser = asyncHandler(async(req, res)=>{
        const {_id} = req.user;
        validateMongodbId(_id);
        try {
          const updateuser = await User.findByIdAndUpdate(_id, {
              firstname: req?.body?.firstname,
              lastname: req?.body?.lastname,
              email: req?.body?.email,
              mobile: req?.body?.mobile,
              occupation: req?.body.occupation
          }, {
            new: true
          });
          res.json(updateuser);
        } catch (error) {
  
          throw new Error(error);
          
        }
   });
 const updatePassword = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if(password){
      user.password = password;
      const updatedpassword = await user.save();
      res.json(updatedpassword);
    }else{
      res.json(user);
    }
});

const forgotpassword = asyncHandler(async(req, res)=>{

});
const createpassword = asyncHandler(async(req,res)=>{

});
const addUser = asyncHandler(async(req, res)=>{

    
    const {firstname, lastname, 
        email, mobile, occupation, 
        password, org} = req.body;
       
        try {

          const  adduser = await User.create({firstname, lastname, 
                email, mobile, occupation, 
                password});
          const addtoorg = await Org.findByIdAndUpdate(org, {
            $push:{org_users:adduser._id.toString()}
          },{new:true});

            res.json(addtoorg);
            
        } catch (error) {

            throw new Error(error);
            
        }


});


const getaUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
       const getuser = await User.findById(id);
       res.json({
           getuser
       })
       
    } catch (error) {
       throw new Error(error);
       
    }
});
const profileUser = asyncHandler(async(req, res)=>{
   const{refreshToken} = req.cookies;
console.log(refreshToken);
    
  try{
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
   console.log(decoded);
   const findone = await User.findById(decoded.id);
console.log(findone);
  if(findone.role == 'user'){
    
   const user = await User.findById(decoded.id).populate("org");
    
   res.json(user);
      
    }else{
    
    res.json(findone);

  }
    
}catch(error){
throw new Error(error);
}
  
}); 

const deleteaUser = asyncHandler(async(req, res)=>{
   const {id} = req.params;
   validateMongodbId(id);
   try {
      const deleteuser = await User.findByIdAndDelete(id);
      res.json({
          deleteuser
      })
      
   } catch (error) {
      throw new Error(error);
      
   }
});

const blockUser = asyncHandler(async(req, res)=>{

 const {id} = req.params;
 validateMongodbId(id);
 try {
   const block = await User.findByIdAndUpdate(id, {
     isBlocked: true,
   },{
     new: true
   });
   res.json({message:"User Blocked"});
 } catch (error) {
   throw new Error(error);
   
 }

});

const unblockUser = asyncHandler(async(req, res)=>{

 const {id} = req.params;
 validateMongodbId(id);
 try {
   const unblock = await User.findByIdAndUpdate(id, {
     isBlocked: false,
   },{
     new: true
   });
   res.json({message:"User unBlocked"});
   
 } catch (error) {
   throw new Error(error);
   
 }
 
});
const getallUser = asyncHandler(async(req, res)=>{
    try {

      const getUsers = await User.find();
      res.json(getUsers);  
        
    } catch (error) {
      
        throw new Error(error);
    }
 });

  


module.exports = {registerSuperuser, loginUser, forgotpassword, createpassword, addUser, addcode, checkcode, 
                 updateUser, logout, updatePassword, getaUser, deleteaUser, blockUser, unblockUser, getallUser, profileUser};