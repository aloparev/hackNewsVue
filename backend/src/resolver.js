// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      posts: async (parent, args, {dataSources}, resolveInfo) => {
        return await dataSources.inMemoryDataAPI.allPosts()
      },
      users: async (parent, args, {dataSources}, _) => {
        return await dataSources.inMemoryDataAPI.allUsers()
      }
    },
    User: {
      posts: async (parent, args, {dataSources}, resolveInfo) => {
        let posts = await dataSources.inMemoryDataAPI.allPosts();
        return posts.filter(e => e.author.name == parent.name)
      }
    },
    Mutation: {
      write: async (parent, args, {dataSources}, resolveInfo) => {
        console.log('Mutation.write.postInput', args.post)
        return await dataSources.inMemoryDataAPI.createPost(args.post)
      },
      upvote: async (parent, args, {dataSources}, resolveInfo) => {
        console.log('Mutation.upvote.args', args)
        return await dataSources.inMemoryDataAPI.upvotePost(args.id, args.voter)
      }
    }
};

module.exports = resolvers