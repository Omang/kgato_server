const mongoose = require('mongoose');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const Signup = asyncHandler(async(req, res)=>{

	const {username, password, usertype} = req.body;

	try{
        const detailsx = await User.create({username: username, password: password, usertype: usertype});
            
	}catch(error){

	}
	
});
const Signin = asyncHandler(async(req, res)=>{
	 const {password, username} = req.body;

	 try{

	 	const login = await User.findOne({username: username});

	 	if(login){
	 		const details = await User.findOne({username: username, password: password});
	 		if (details) {
	 			res.json(details);
	 		} else {
	 			res.json({message: "Wrong details"});
	 		}
        }else{
        	res.json({message: "Wrong details"});
        }

	 }catch(e){
	 	
	 }
})
const Forgetpassword = asyncHandler(async(req, res)=>{
    
})


module.exports = {Signup};