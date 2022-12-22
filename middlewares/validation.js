const { body, validationResult } = require('express-validator');

module.exports.validatePassword = body('password')
  .isLength({ min: 8 })
  .trim()
  .withMessage('The password has to be at least 8 characters long.');

module.exports.validatePasswordMatch = body('password')
  .custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      return false;
    }
    return true;
  })
  .withMessage("Passwords don't match");

module.exports.validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please enter a valid email address.');

module.exports.validateUsername = body('username')
  .isLength({ min: 3, max: 13 })
  .trim()
  .withMessage('The username has to be at least 6 characters long.');
module.exports.validatePhone = body('phone')
  .isLength({min: 10})
  .trim()
  .withMessage("The phone is invalid");

module.exports.validationResult = validationResult;
