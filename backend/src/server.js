const {ApolloServer, makeExecutableSchema} = require('apollo-server');
const {Post, PostsDataSource} = require('./DataSource/posts-data-source');
const {User, UsersDataSource} = require('./DataSource/users-data-source');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const {applyMiddleware} = require('graphql-middleware');
const {shield} = require('graphql-shield');
const {isAuthenticated} = require('./Permissions/user-rules');
const {context} = require('./context')

const postsMemory = new PostsDataSource();
const usersMemory = new UsersDataSource();

usersMemory.users = [
  new User({name:'An', email:'an@gmail.com', password:'12345678'}),
  new User({name:'Ilona', email:'ilona@gmail.com', password:'12345678'}),
  new User({name:'Andrej', email:'andrej@gmail.com', password:'12345678'})
];

postsMemory.posts =[
                    new Post({title: "Just", author: usersMemory.users[0]}),
                    new Post({title: "VueJS", author: usersMemory.users[1]}),
                    new Post({title: "Rocks", author: usersMemory.users[2]}),
                    new Post({title: "CountrysRoad", author: usersMemory.users[1]})
                  ];

//Permissions
const permissions = shield({
  Mutation: {
    delete:isAuthenticated,
  },
}, { allowExternalErrors: true })

const dataSources = () => ({postsDataSrc: postsMemory, usersDataSrc: usersMemory});

const schema = applyMiddleware(
  makeExecutableSchema({typeDefs, resolvers}),
  permissions
)

class Server {

  constructor(opts) {
    const defaults = {
      schema,
      context,
      dataSources
    }
    return new ApolloServer({...defaults, ...opts})
  }
}

module.exports = Server