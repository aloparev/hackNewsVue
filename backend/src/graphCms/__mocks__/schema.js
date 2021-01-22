const { addMocksToSchema }= require ('@graphql-tools/mock');
const { makeExecutableSchema } = require('apollo-server')
const { join }= require( 'path');
const mocks = require('./mockData');

const fs = require('fs');
const util = require('util');   
const readFile = util.promisify(fs.readFile);

module.exports = async () => {
  const content = await readFile(join(__dirname, 'schema.gql'),'utf8');
   const typeDefs =  content;
const schema =  makeExecutableSchema({ 
  typeDefs,
  resolverValidationOptions: { requireResolversForResolveType: false }
 });
const schemaWithMocks = addMocksToSchema({ schema,mocks,preserveResolvers: true });
return schemaWithMocks;
};




