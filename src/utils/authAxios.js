const axios = require('axios').default;
const baseUrl = process.env.BASE_URL;

const authorizationAxios = async (token) => {
    try {
        await axios.get(`${baseUrl}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Axios error:', error.message);
        throw error;
    }
};

module.exports = authorizationAxios