const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        trim: true, 
        index: { unique: true }, 
        minlength: 6,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, 
        unique: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
      },
      password: {
        type: String,
        // required: true,
        minlength: 8, 
        trim: true,
        default: "",
      },
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
      otp: {
        type: String,
        required: true,
      }, 
      gender: {
        type: String,
        enum: {
          values: ['MALE', 'FEMALE'],
          message: '{VALUE} is not supported'
        }     
      },
      dateOfBirth: {
        type: Date,
      },
      country: {
        type: String,
        trim: true,
        uppercase: true
      },
      city: {
        type: String,
        trim: true,
        uppercase: true,
      }
    },
    {
      timestamps: true
    }
);


module.exports = mongoose.model('User', userSchema);