const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config');

module.exports= function context({ req }) {
  const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  try {
    let token = req.headers.authorization || ''
    token = token.replace('Bearer ', '')
    const decodedJwt = jwt.verify(
      token,
      JWT_SECRET
    )
    return { ...decodedJwt, jwtSign }
    
  } catch (e) {
    return { jwtSign }
  }
}
