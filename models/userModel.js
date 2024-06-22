const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    firstname:{
        type: String,
        required: true
    },
    lastname:{type: String, required:true},
    email: {type: String, required: true, unique: true, trim: true},
    mobile: {type:Number, required:true,  unique: true, trim: true},
    occupation: {type: String, required: true},
    org:{type: mongoose.Schema.Types.ObjectId, ref: "doc"},
    isBlocked:{type:Boolean},
    password: {type:String},
    refreshToken:{type:String},
    role: {type: String,
          default: 'user' }

}, {timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


module.exports = mongoose.model('User', userSchema);
