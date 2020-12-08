require('dotenv-flow').config()
const jwt = require('jsonwebtoken')

const context = ({ req }) => {
  let token = req.headers.authorization || ''
  token = token.replace('Bearer ', '')

  try {
    const decodedJwt = jwt.verify(
      token,
      process.env.JWT_SECRET
    )
    return { decodedJwt, jwt }
  } catch (e) {
    return { jwt }
  }
}

module.exports = { context }
