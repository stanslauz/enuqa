const { use } = require('../routes');
const UserModel = require('../schema/userSchema');


class UserService {


    static async findByEmail(email) {
        // throw new Error('Not implemented');
        return UserModel.findOne({ email }).exec();
      }
    
      /**
       * Finds and returns a user by username
       *
       * @param {*} username
       * @returns database result
       */
      static async findByUsername(username) {
        // throw new Error('Not implemented');
        return UserModel.findOne({ username }).exec();
      }
  
      static async createUser(username, email, lastName, firstName,otp, password) {
       
        const user = new UserModel();
        user.email = email;
        user.lastName = lastName;
        user.firstName = firstName;
        user.password = password;
        user.username = username;
        user.otp= otp;
        const savedUser = await user.save();
        return savedUser;
      }
    
      static async createSocialUser(username, email, oauthProfile) {
        const user = new UserModel();
        user.email = email;
        user.oauthprofiles = [oauthProfile];
        user.password = crypto.randomBytes(10).toString('hex');
        user.username = username;
        const savedUser = await user.save();
        return savedUser;
      }
    
      /**
       * Creates a new password reset token
       *
       * @param {*} userId
       * @returns the created token
       */
      static async createPasswordResetToken(userId) {
        // throw new Error('Not implemented');
        const passwordReset = new PasswordResetModel();
        passwordReset.userId = userId;
        const savedToken = await passwordReset.save();
        return savedToken.token;
      }
    
      /**
       *
       * @param {*} userId
       * @param {*} token
       * @returns the token object if found
       */
      static async verifyPasswordResetToken(userId, token) {
        // throw new Error('Not implemented');
        return PasswordResetModel.findOne({
          token,
          userId,
        }).exec();
      }
    
      /**
       * Deletes a password reset token
       * @param {*} token
       * @returns
       */
      static async deletePasswordResetToken(token) {
        // throw new Error('Not implemented');
        return PasswordResetModel.findOneAndDelete({
          token,
        }).exec();
      }
    
      /**
       * Changes a user's password
       * @param {*} userId
       * @param {*} password
       */
      static async changePassword(userId, password) {
        // throw new Error('Not implemented');
        const user = await UserModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        user.password = password;
        return user.save();
      }
    
      // Helpers
    
      /**
       * Finds a user by id
       * @param {*} id
       * @returns a user
       */
      static async findById(id) {
        return UserModel.findById(id).exec();
      }
    
      static async findByOAuthProfile(provider, profileId) {
        return UserModel.findOne({
          oauthprofiles: { $elemMatch: { provider, profileId } },
        }).exec();
      }
    
      /**
       * returns the password reset token for a user
       * @param {*} id
       * @returns a user
       */
      static async getResetToken(userId) {
        return ResetTokenModel.findOne({ userId }).exec();
      }
    
      /**
       * Get all users
       *
       * @returns a list of users
       */
      static async getList() {
        return UserModel.find().sort({ createdAt: -1 }).exec();
      }
    
      /**
       * Deletes a user
       *
       * @returns result
       */
      static async deleteUser(id) {
        return UserModel.findByIdAndDelete(id);
      }
}

module.exports = UserService;