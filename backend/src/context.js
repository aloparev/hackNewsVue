require('dotenv').config();
const jwt = require('jsonwebtoken');

const context = ({req}) => {
    
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ', '');
    
    try {
        const decodedJwt = jwt.verify(
          token,
          process.env.JWT_SECRET
        );

        console.log(decodedJwt)
        
        return {decodedJwt};

    } catch(e) {
        return {}
    }
}

module.exports = {context};