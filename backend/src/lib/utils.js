const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '15d',
    });

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // prevent XSS attacks
        sameSite: 'none',
        path: "/",  
        secure: true,

    });

    return token;
};

module.exports = { generateToken };
