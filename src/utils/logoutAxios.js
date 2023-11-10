const axios = require('axios').default;
const baseUrl = process.env.BASE_URL;

const logoutAxios = async () => {
    try {
        await axios.get(`${baseUrl}/logout`, {
            headers: {
                'Authorization': 'Sem token'
            }
        })
    } catch (error) {
        console.error('Axios error:', error.message);
        throw error;
    }
}

module.exports = logoutAxios