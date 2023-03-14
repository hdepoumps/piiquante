//  middleware/auth.js
const jwt = require('jsonwebtoken');
const {login} = require("../controllers/user");

module.exports = (req, res, next) => {
    //console.log(req.body);
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};