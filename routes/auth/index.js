const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const validation = require('../../middlewares/validation');
const UserService = require('../../services/UserService');
const generateOTP = require('../../services/otp');
const sendNotification = require('../../services/NotificationService');;
  router.post('/signUp',
    // Here we call middlewares to validate the user inputs
    validation.validateUsername,
    validation.validateEmail,
    validation.validatePhone,
    validation.validatePasswordMatch,
    async (req, res, next) => {
      try {
        // This block deals with processing the validation input
        const validationErrors = validation.validationResult(req);
        const errors = [];
        if (!validationErrors.isEmpty()) {
          validationErrors.errors.forEach((error) => {
            errors.push(error.param);
          });
          
          return res.status(400).send({messages: `invalid ${errors[0]} `});
        } else {
          const existingEmail = await UserService.findByEmail(req.body.email);
          const existingUsername = await UserService.findByUsername(req.body.username);

          if (existingEmail || existingUsername) {
            errors.push('email');
            errors.push('username');
            console.log(errors);
           return res.status(400).send({messages: "username or email exists"});
          }
        }

        const otpGenerated = generateOTP();

      
          sendNotification.sendMail({
            to: req.body.email,
           OTP: otpGenerated,
          name: req.body.firstName});
  

        const createdUser = await UserService.createUser(
          req.body.username,
          req.body.email,
          req.body.firstName,
          req.body.lastName,
          otpGenerated,
          req.body.password
        );
     
        
        return res.status(200).json({userId: createdUser.id, message: "user created succesfully"
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  
    router.post('/resend',async(req, res, next)=>{
      try {
        const otpGenerated = generateOTP();
        const existingUser = await UserService.findById(req.body.userId);
        
        if(existingUser)
        {
          UserService.updateToken(existingUser.email, otpGenerated);
          
            sendNotification.sendMail({
              to: existingUser.email,
             OTP: otpGenerated,
            name: existingUser.username});
        
         
          
          return res.status(200).send({messege: "otp send successfully"});
        }

        return res.status(400).send({message: "user does not exists"});
      } catch (error) {
        return next(err);
      }
    });


    router.post('/verify', async (req, res)=>{
      const existingUser = await UserService.findById(req.body.userId);
      if(existingUser.otp == req.body.otp){
        const updatedUser = await UserService.enableUser(existingUser.id);
        return res.status(200).json({userId: existingUser.id, status: updatedUser.enabled});
      }
      return res.status(400).json({message: "otp do not match"});
    });




module.exports = router;