const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

   patient_id: {type: mongoose.Schema.Types.ObjectId, ref: "Patient"}
   date_by: {type: String}, 
   from_on: {type: String},
   to_on: {type: String}

   
}, {timestamps: true});



module.exports = mongoose.model('Giver', userSchema);
