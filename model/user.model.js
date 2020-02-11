const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true 
  }
});


UserSchema.pre('save', async function(next){
    const user = this;
    //encryption of password
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  });
  
  
  UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    //Compare passwords 
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  }
  
  const UserModel = mongoose.model('user',UserSchema);
  
  module.exports = UserModel;