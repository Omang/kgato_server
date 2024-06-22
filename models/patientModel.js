const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const patientSchema = new mongoose.Schema({

   Firstname: {type: String}, 
   Lastname: {type: String},
    DOB: {type: String}, Gender: {type: String}, 
    dateJoined: {type: String},
    Giver_relation: {type: mongoose.Schema.Types.ObjectId, ref: "Giverman"},
    relationship: {type: String},
    appointments:[{type: mongoose.Schema.Types.ObjectId, ref: "Appointment"}]

}, {timestamps: true});



module.exports = mongoose.model('Patient', patientSchema);
