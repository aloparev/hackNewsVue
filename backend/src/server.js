const {ApolloServer, makeExecutableSchema} = require('apollo-server');
const {PostsDataSource} = require('./DataSources/posts-data-source');
const {UsersDataSource} = require('./DataSources/users-data-source');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const {applyMiddleware} = require('graphql-middleware');
const {shield, and, not} = require('graphql-shield');
const utils = require('./utils');
const {isAuthenticated, isPasswordShort, isEmailTaken} = require('./permissions');
const {context} = require('./context')
const { UserInputError } = require('apollo-server');

const postsMemory = new PostsDataSource();
const usersMemory = new UsersDataSource();

usersMemory.users = [...utils.defaultUsers];

postsMemory.posts = [...utils.defaultPosts];

//Permissions
const permissions = shield({
  Mutation: {
    write:isAuthenticated,
    upvote:isAuthenticated,
    delete:isAuthenticated,
    downvote:isAuthenticated,
    signup:and(
      not(isEmailTaken, new UserInputError("This email already is taken by another user")),
      not(isPasswordShort, new UserInputError("Accept only passwords with a length of at least 8 characters"))
    )
  },
}, { allowExternalErrors: true })

const context = ({req, res}) => ({req, res});

const dataSources = () => ({postsDataSrc: postsMemory, usersDataSrc: usersMemory});

class Server {
  
  constructor(opts) {
    
    const defaults = {
      typeDefs,
      resolvers,
      context,
      dataSources
    }
    
    return new ApolloServer({...defaults, ...opts})
  }
}

module.exports = Server