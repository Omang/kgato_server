const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const Giverman = require('../models/giverModel');
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const { generateToken } = require('../config/jwtToken');
const {validateMongodbId} = require('../utils/validateMongoId');
const  {generateRefreshToken} = require('../config/refreshToken');
const Appointment = require('../models/appointmentModel');


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
      console.log(req.body);
     const {
  Firstname,
  Lastname,
  DOB,
  Gender,
  dateJoined,
  Giver_relation
} = req.body

        try{

          const savedata = await Patient.create({
            Firstname: Firstname,
  Lastname: Lastname,
  DOB: DOB,
  Gender: Gender,
  dateJoined:dateJoined
          });

          if (savedata) {
            res.json(savedata).status(200);
          } else {
            res.json({message:"not save"});
          }

        }catch(e){
          throw new Error(e);
        }

})

const addgivertopatient = asyncHandler(async(req, res)=>{
  const {patient_id, giver_id} = req.body;
  try{

    const addto = await Giverman.findByIdAndUpdate(giver_id, {
        $push:{
          patients: patient_id
        }  
    });
    if (addto) {
      const addtopatient = await Patient.findByIdAndUpdate(patient_id, {
        giver_id: giver_id
      });
        res.json(addto);
    } else {
      res.json({message: "not saved"});
    }

  }catch(e){
    throw new Error(e);
  }
})

const addgiver = asyncHandler(async(req, res)=>{
      const {
        childid, Firstname, Lastname, DOB, Gender, email, cellphone, worknumber, homenumber,
        nationality, occupation, employer, plotnumber, ward, place, postaladd, med_id, med_number,
        dateJoined, contribution, allergies, aboutus, relationship
      } = req.body;
  try{

    const savedata = await Giverman.create({
        Firstname: Firstname, Lastname:Lastname, DOB:DOB, Gender: Gender, 
        email: email, cellphone: cellphone, worknumber: worknumber, homenumber: homenumber,
        nationality: nationality, occupation: occupation, 
        employer: employer, plotnumber: plotnumber, ward: ward, 
        place: place, postaladd: postaladd, med_id: med_id, med_number: med_number,
        dateJoined: dateJoined, contribution: contribution, allergies: allergies, aboutus: aboutus,
        patients:[childid]
      });

    if (savedata) {
      const addtochild = await Patient.findByIdAndUpdate(childid, {
        
          Giver_relation: childid,
        relationship: relationship
      })

      res.json(savedata).status(200);

    } else {
      res.json({message: "not saved"});
    }

  }catch(e){

    throw new Error(e);
  }

})
const editpatient = asyncHandler(async(req, res)=>{
  const {patient_id, Firstname, Lastname, DOB, Gender, dateJoined, Giver_relation} = req.body;

  try{

    const editone = await Patient.findByIdAndUpdate(patient_id, {
      Firstname: Firstname, Lastname: Lastname, DOB: DOB, Gender: Gender, dateJoined: dateJoined
       
    })
    if (editone) {
      res.json(editone).status(200);
    } else {
      res.json({message: "not edited"});
    }

  }catch(e){
    throw new Error(e);
  }

})
const editgiver = asyncHandler(async(req, res)=>{

  const {
        giver_id, Firstname, Lastname, DOB, Gender, email, cellphone, worknumber, homenumber,
        nationality, occupation, employer, plotnumber, ward, place, postaladd, med_id, med_number,
        dateJoined, contribution, allergies, aboutus
      } = req.body;

  try{

    const editone = await Giverman.findByIdAndUpdate(giver_id, {
        Firstname: Firstname, Lastname:Lastname, DOB:DOB, Gender: Gender, 
        email: email, cellphone: cellphone, worknumber: worknumber, homenumber: homenumber,
        nationality: nationality, occupation: occupation, 
        employer: employer, plotnumber: plotnumber, ward: ward, 
        place: place, postaladd: postaladd, med_id: med_id, med_number: med_number,
        dateJoined: dateJoined, contribution: contribution, allergies: allergies, aboutus: aboutus
      })
    if (editone) {
      res.json(editone).status(200);
    } else {
      res.json({message: "not edited"});
    }

  }catch(e){
    throw new Error(e);
  }

})
const getgiver = asyncHandler(async(req, res)=>{

  const {id} = req.params;

  try{
   const getone = await Giverman.findById(id).populate("patients");
   if(getone){
    res.json(getone).status(200);
   }else{
    res.json({message: "something went wrong"}).status(500);
   }
  }catch(e){
    throw new Error(e)
  }

})
const getpatient = asyncHandler(async(req, res)=>{
   const {id} = req.params;

  try{
   const getone = await Patient.findById(id).populate("Giver_relation").populate("appointments");
   if(getone){
    res.json(getone).status(200);
   }else{
    res.json({message: "something went wrong"}).status(500);
   }
  }catch(e){
    throw new Error(e)
  }

})

const allpatient = asyncHandler(async(req, res)=>{

  try{

    const getall = await Patient.find();

    if(getall){
      res.json(getall);
    }else{
      res.json({message: "not found"})
    }

  }catch(e){
    throw new Error(e);
  }

})
const addapp = asyncHandler(async(req, res)=>{

  const {patient_id, onthe, from_on, to_on} = req.body;
  try{

    const {_id} = await Appointment.create(req.body);

    if(_id){
      const addone = await Patient.findByIdAndUpdate(patient_id,{
        $push:{
          "appointments": _id.toString()
        }
      });

        res.json({_id, onthe, from_on, to_on}).status(200);

    }else{
      res.json({message: "Not Saved"}).status(500);
    }

  }catch(e){
    throw new Error(e);
  }

})
const patientapps = asyncHandler(async(req, res)=>{

  const {patient_id} = req.params;

  try{

    const getone = await Appointment.find({patient_id:patient_id});
    if (getone) {
      res.json(getone).status(200);
    } else {
      res.json({message: "something went wrong"});
    }

  }catch(e){

    throw new Error(e);

  }

})
const patientappx = asyncHandler(async(req, res)=>{

    const {id} = req.params;
    try{

      const getone = await Appointment.findById(id);
      if (getone) {
        res.json(getone).status(200);
      } else {
        res.json({message: "something went wrong"});
      }

    }catch(e){
      throw new Error(e);
    }

})
const editpatientapp = asyncHandler(async(req, res)=>{
  const {app_id, onthe, from_on, to_on} = req.body;

  try{

    const editone = await Appointment.findByIdAndUpdate(app_id,{
      onthe: onthe, from_on: from_on, to_on: to_on
    });
    if (editone) {
      res.json(editone).status(200);
    } else {
      res.json({message: "something went wrong"})
    }

  }catch(e){
    throw new Error(e);
  }

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
  


module.exports = {registeruser, loginUser, logout, addpatient, addgiver, editpatient, 
                 editgiver, getpatient, getgiver, allpatient, addapp, patientapps, patientappx, editpatientapp,
                  addpay, getpay, patientpays, makepay, allpays};