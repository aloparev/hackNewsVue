require('dotenv').config()
const jwt = require('jsonwebtoken')

const context = ({ req }) => {
  let token = req.headers.authorization || ''
  token = token.replace('Bearer ', '')

  try {
    const decodedJwt = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // console.log("context here", decodedJwt)

    return { decodedJwt, jwt }
  } catch (e) {
    return { jwt }
  }
}

module.exports = { context }
