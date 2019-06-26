const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:  process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = function (email, subject, message) {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: message
  };

  return transporter.sendMail(mailOptions)
};


module.exports = {
  sendEmail: sendEmail
};
