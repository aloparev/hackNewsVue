require('dotenv').config();
const {sign} = require('jsonwebtoken');

const createAccessToken = id => {
    return sign({ id }, process.env.JWT_SECRET, { algorithm: 'HS256' });
}

module.exports = {createAccessToken}