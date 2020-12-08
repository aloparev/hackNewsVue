const {ApolloServer, makeExecutableSchema, UserInputError} = require('apollo-server');
const {PostsDataSource} = require('./DataSources/posts-data-source');
const {UsersDataSource} = require('./DataSources/users-data-source');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const {applyMiddleware} = require('graphql-middleware');
const {shield, and, not} = require('graphql-shield');
const utils = require('./utils');
const {isAuthenticated, isPasswordShort, isEmailTaken, mayVote, mayDelete, postFound, enteredCorrectPassword} = require('./permissions');
const {context} = require('./context')

const postsMemory = new PostsDataSource();
const usersMemory = new UsersDataSource();

usersMemory.users = [...utils.defaultUsers];

postsMemory.posts = [...utils.defaultPosts];

//Permissions
const permissions = shield({
  Mutation: {
    write:isAuthenticated,
    login: enteredCorrectPassword,
    upvote:and(isAuthenticated,mayVote, postFound),
    delete:and(isAuthenticated,mayDelete, postFound),
    downvote:and(isAuthenticated,mayVote, postFound),
    signup:and(isEmailTaken, isPasswordShort)
  },
}, { allowExternalErrors: true })

const dataSources = () => ({ postsDataSrc: postsMemory, usersDataSrc: usersMemory })

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
)

class Server {
  constructor (opts) {
    const defaults = {
      typeDefs,
      resolvers,
      context,
      dataSources
    }

    return new ApolloServer({ ...defaults, ...opts })
  }
}

module.exports = Server
