//Sending emails/verification emails
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');

dotenv.config({ path: "config/.env" });

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST , // HOST of your email provider
    port: process.env.MAIL_PORT , // PORT of your email provider
    secure: false,  // No TLS required for Mailtrap sandbox
    auth: {
        user: process.env.MAIL_USERNAME, 
        pass: process.env.MAIL_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4  // Force IPv4 to avoid IPv6 issues
});

const sendRegistrationEmail = async (newUserEmail, verificationUrl) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM, // sender address
            to: newUserEmail,  // Send to the user's email
            subject: 'Please Verify Your Email',
            text: `Please verify your email by clicking the following link: ${verificationUrl}`,
            html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`
        });
        
        
        console.log('MAIL_FROM:', process.env.MAIL_FROM);
        // Optionally log some feedback (optional)
        console.log('Verification email sent to:', newUserEmail);

    } catch (error) {
        console.error('Error sending email:', error);
    }
};

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
        console.log(error);
        } else {
        console.log("Server is ready to take our messages");
        }
    });

  module.exports = sendRegistrationEmail;
