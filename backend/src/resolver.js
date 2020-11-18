const resolvers = {
    Query: {
      posts: async (parent, args, {dataSources}) => {
        return await dataSources.postsDataSrc.allPosts()
      },
      users: async (parent, args, {dataSources}) => {
        return await dataSources.usersDataSrc.allUsers()
      }
    },
    User: {
      posts: async (parent, args, {dataSources}) => {
        let posts = await dataSources.postsDataSrc.allPosts();
        return posts.filter(e => e.author.name == parent.name)
      }
    },
    Mutation: {
      write: async (parent, args, {dataSources}) => {
        console.log('Mutation.write.postInput', args.post)
        return await dataSources.postsDataSrc.createPost(args.post)
      },
      upvote: async (parent, args, {dataSources}) => {
        console.log('Mutation.upvote.args', args)
        return await dataSources.postsDataSrc.upvotePost(args.id, args.voter)
      },
      downvote: async (parent, args, {dataSources}) => {
        return await dataSources.postsDataSrc.downvotePost(args.id, args.voter)
      },
      delete: async (parent, args, {dataSources}) => {
        return await dataSources.postsDataSrc.deletePost(args.id)
      }
    }
};

module.exports = resolvers