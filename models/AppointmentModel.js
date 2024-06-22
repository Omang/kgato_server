const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

   patient_id: {type: mongoose.Schema.Types.ObjectId, ref: "Patient"},
   onthe: {type: String}, 
   from_on: {type: String},
   to_on: {type: String}

   
}, {timestamps: true});



module.exports = mongoose.model('Appointment', userSchema);
