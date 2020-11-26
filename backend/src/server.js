const {ApolloServer} = require('apollo-server');
const {Post, PostsDataSource} = require('./DataSource/posts-data-source');
const {User, UsersDataSource} = require('./DataSource/users-data-source');
const typeDefs = require('./schema');
const resolvers = require('./resolver');

const postsMemory = new PostsDataSource();
const usersMemory = new UsersDataSource();

postsMemory.posts =[
                    new Post({title: "Just", author: {name: 'Ilona'}}),
                    new Post({title: "VueJS", author: {name: 'Andrej'}}),
                    new Post({title: "Rocks", author: {name: 'An'}}),
                    new Post({title: "CountrysRoad", author: {name: 'Ilona'}})
                  ];

usersMemory.users = [
                      new User('An'),
                      new User('Ilona'),
                      new User('Andrej')
                    ];

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