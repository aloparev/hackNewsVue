const { addMocksToSchema }= require ('@graphql-tools/mock');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('apollo-server')
const { graphql } = require('graphql');
const casual = require('casual');

const permissions = require('../../permissions');

const fs = require('fs');
const util = require('util');   
const readFile = util.promisify(fs.readFile);

const jwtSign = (payload) => jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
const contextMock = {jwtSign}


module.exports = async (query) => {
  const content = await readFile('./src/Test/utils/schema.gql','utf8');
   const typeDefs =  content;
const schema =  makeExecutableSchema({ 
  typeDefs,
  resolverValidationOptions: { requireResolversForResolveType: false }
 });
 casual.seed(123);
 const mocks = {
  Person: () => ({
    name:  'TestUser',
    id: 1,
    email: 'testmail@gmail.com',
    password: '12345678'
  }),
  Post: () => ({
    title: "Mocktitle"
  })
};
const schemaWithMocks = addMocksToSchema({ schema,mocks,preserveResolvers: true });
const permissionSchema = applyMiddleware(schemaWithMocks, permissions);
return ((await graphql( permissionSchema, query, contextMock)));
};




