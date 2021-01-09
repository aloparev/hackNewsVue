const schema = require('./schema');
const { graphql } = require('graphql');

const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
const contextMock = {jwtSign}

module.exports = async (query) => {
return ((await graphql( schema, query,contextMock)))
};