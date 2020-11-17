const { ApolloServer} = require('apollo-server');
const PostsDataSource = require('./posts-data-source');
const UsersDataSource = require('./users-data-source');
const typeDefs = require('./schema');
const resolvers = require('./resolver');

const postsMemory = new PostsDataSource();
const usersMemory = new UsersDataSource();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: ()=> {
    return {postsDataSrc:postsMemory,
      usersDataSrc:usersMemory
    };
  }
});


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
