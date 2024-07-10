const jwt = require('jsonwebtoken');

function verifyCompany(req, res, next) {
    if (req.user.userType !== 'company') {
        return res.status(403).send({
            message: 'Access denied. Only companies can perform this action.'
        });
    }
    next();
  }

function verifyAuth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        res.status(401).send({
            message: 'Access denied, No token provided'
        })
    };

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        // { username: 'ahmetuzgor' , email: 'ahmetuzgor@gmail.com' }
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}

module.exports = {
    verifyAuth,
    verifyCompany
};