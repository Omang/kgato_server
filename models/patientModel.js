const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

   Firstname: {type: String}, 
   Lastname: {type: String},
    DOB: {type: String}, Gender: {type: String}, 
    dateJoined: {type: String},
    Giver_relation: {type: mongoose.Schema.Types.ObjectId, ref: "Giver"},
    appointments:[{type: mongoose.Schema.Types.ObjectId, ref: "Appointment"}]

}, {timestamps: true});



module.exports = mongoose.model('Patient', userSchema);
