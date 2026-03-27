const axios = require('axios');

async function testRegistration() {
    try {
        const res = await axios.post('http://localhost:8080/api/auth/register', {
            fullName: 'Manusha Bandara',
            email: 'Manu12@gmail.com',
            mobileNumber: '0778445621',
            password: 'password123'
        });
        console.log(res.data);
    } catch (err) {
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testRegistration();
