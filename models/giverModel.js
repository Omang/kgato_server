const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

   Firstname: {type: String}, Lastname: {type: String},
   DOB: {type: String}, 
    Gender: {type: String}, 
    email: {type: String}, 
    cellphone: {type: String}, 
    worknumber: {type: String}, homenumber: {type: String},
   nationality: {type: String}, 
   occupation: {type: String}, 
   employer: {type: String}, 
   plotnumber: {type: String}, ward: {type: String}, 
   place: {type: String}, 
   postaladd: {type: String}, 
   med_id: {type: String}, med_number: {type: String},
        dateJoined: {type: String}, contribution: {type: String}, allergies: {type: String}, 
        aboutus: {type: String},
        patients:[{type: mongoose.Schema.Types.ObjectId, ref: "Patient"}]
}, {timestamps: true});



module.exports = mongoose.model('Giver', userSchema);
