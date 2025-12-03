const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function test() {
    const username = 'otp_script_' + Date.now();
    const email = `${username}@example.com`;
    const password = 'password123';

    console.log(`Testing with user: ${username}`);

    try {
        // 1. Register
        console.log('1. Registering...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password
        });
        const token = regRes.data.token;
        console.log('✅ Registered! Token:', token ? 'Yes' : 'No');

        // 2. Verify Email Trigger
        console.log('2. Triggering Email Verification...');
        const verifyRes = await axios.post(`${API_URL}/auth/verify-email`, {}, {
            headers: { 'x-auth-token': token }
        });
        console.log('✅ Verify API Response:', verifyRes.data);

    } catch (err) {
        console.error('❌ ERROR:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

test();
