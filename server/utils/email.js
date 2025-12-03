const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    console.log(`Attempting to send OTP to ${email}...`);
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email - Task App',
            text: `Your verification code is: ${otp}. It expires in 10 minutes.`
        });
        console.log('Email sent successfully!');
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

module.exports = sendOTP;
