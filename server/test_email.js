require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function test() {
    console.log('----------------------------------------');
    console.log('Testing Email Configuration...');
    console.log('User:', process.env.EMAIL_USER);
    // Hide password for security in logs, just show length
    console.log('Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    console.log('----------------------------------------');

    try {
        console.log('1. Verifying connection to Gmail...');
        await transporter.verify();
        console.log('✅ Connection Successful!');

        console.log('2. Sending test email to self...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from Task App',
            text: 'If you see this, your email configuration is correct!'
        });
        console.log('✅ Email Sent Successfully!');
    } catch (err) {
        console.error('❌ ERROR FAILED:');
        console.error(err);
    }
    console.log('----------------------------------------');
}

test();
