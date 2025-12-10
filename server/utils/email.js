const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use secure port 465
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    console.log(`Sending email to ${to}...`);
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log('Email sent successfully!');
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

const sendOTP = async (email, otp) => {
    return await sendEmail(
        email,
        'Verify your email - Task App',
        `Your verification code is: ${otp}. It expires in 10 minutes.`
    );
};

module.exports = { sendOTP, sendEmail };
