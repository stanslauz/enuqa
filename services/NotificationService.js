const nodemailer = require('nodemailer');

const { MAIL_SETTINGS } = require('../constants/constants');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

class NotificationService{

static async sendMail(params){
    try {
        let info = await transporter.sendMail({
          from: MAIL_SETTINGS.auth.user,
          to: params.to, // list of receivers
          subject: 'ENUQA OTP', // Subject line
          html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
            background-color: blue
          >
            <h2>Hi, ${params.name}. Welcome to ENUQA.</h2>
            <h4>You are officially In</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
            <p style="margin-top:50px;">If you do not request for verification please do not respond to the mail. Do not share the otp with anyone.</p>
          </div>
        `,
        });
        return info;
      } catch (error) {
        console.log(error);
        return false;
      }

}
}

module.exports = NotificationService;