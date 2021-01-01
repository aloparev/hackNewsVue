const Schema = require('./schema');
const context = require('./context');
const {ApolloServer} = require('apollo-server');

module.exports = async (opts) => {
  const schema = await Schema();
  return new ApolloServer({ schema, context, ...opts });
};