const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config');

module.exports = async function context() {

  const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });

    return { jwtSign }

}
