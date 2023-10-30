const axios = require('axios').default;
const baseUrl = process.env.BASE_URL;

const authorizationAxios = async (token) => {
    try {
        const response = await axios.get(`${baseUrl}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response;
    } catch (error) {
        console.error('Axios error:', error.message);
        throw error;
    }
};

module.exports = authorizationAxios