require('dotenv').config();
const {ApolloServer, makeExecutableSchema} = require('apollo-server');
const {PostsDataSource} = require('./DataSources/posts-data-source');
const {UsersDataSource} = require('./DataSources/users-data-source');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const {applyMiddleware} = require('graphql-middleware');
const {shield} = require('graphql-shield');
const utils = require('./utils');
const {context} = require('./context')

const postsMemory = new PostsDataSource();
const usersMemory = new UsersDataSource();

usersMemory.users = utils.defaultUsers;

postsMemory.posts = utils.defaultPosts;

//Permissions
const permissions = shield({
  Mutation: {
    write:utils.isAuthenticated,
    upvote:utils.isAuthenticated,
    delete:utils.isAuthenticated,
    downvote:utils.isAuthenticated
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
exports.permissions= permissions;