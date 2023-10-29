const getLogin = (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
};

const getSignUp = (req, res) => {
    res.sendFile(__dirname + '/public/sign-up.html')
};

module.exports = {
    getLogin,
    getSignUp
}