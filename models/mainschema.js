const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true

  },
  dateOfBirth: {
    type:String,
  },
  pensionAccountNumber: {
    type: String,
  },
  contactInformation: {
    type: String,
  },
  lifeCertificate: {
    type: String,
  },
  hasUploadedLifeCertificate: {
    type: Boolean,
    default: false
  },
  aadharNumber: {
    type: String,
  },
  photo: {
    type: String,
  },
  signature: {
    type: String,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  isFamilyPensioner: {
    type:String,
  },
});

UserSchema.pre('save', function(next) {
  const user = this;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const isNovember = currentMonth === 10; 
  const isJanuary = currentMonth === 0;

  if (user.isFamilyPensioner === 'Yes') {
    if (isNovember && !user.hasUploadedLifeCertificate) {
      user.lifeCertificate = null; 
      user.hasUploadedLifeCertificate=false
      return next(new Error('Family pensioners must upload their life certificate in November.'));
    }
  } else if (user.isFamilyPensioner === 'No') {
    if (isJanuary && !user.hasUploadedLifeCertificate) {
      user.lifeCertificate = null;
      user.hasUploadedLifeCertificate=false 
      return next(new Error('Pensioners must upload their life certificate in January.'));
    }
  }

  return next();
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
