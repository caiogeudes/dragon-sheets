const logoutAxios = require('../utils/logoutAxios');

const getLogout = async (req, res) => {
    try {
        await logoutAxios();
        return res.status(200).redirect('/main');
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
    }
}

module.exports = {
    getLogout
}