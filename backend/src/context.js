const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config');

module.exports = async function context({ req }) {
  let token = req.headers.authorization || ''
  token = token.replace('Bearer ', '')
  const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });

  try {
    const decodedJwt = await jwt.verify(
      token,
      JWT_SECRET
    )
    return { ...decodedJwt, jwtSign }
    
  } catch (e) {
    return { jwtSign }
  }
}
