const resolvers = {
    Query: {
      posts: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.allPosts()
      },
      users: async (parent, args, context) => {
        return await context.dataSources.usersDataSrc.allUsers()
      }
    },
    User: {
      posts: async (parent, args, context) => {
        let posts = await context.dataSources.postsDataSrc.allPosts();
        return posts.filter(e => e.author.name == parent.name)
      }
    },
    Mutation: {
      write: async (parent, args, context) => {
        console.log('Mutation.write.postInput', args.post)
        return await context.dataSources.postsDataSrc.createPost(args.post)
      },
      upvote: async (parent, args, context) => {
        console.log('Mutation.upvote.args', args)
        return await context.dataSources.postsDataSrc.upvotePost(args.id, args.voter)
      },
      downvote: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.downvotePost(args.id, args.voter)
      },
      delete: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.deletePost(args.id)
      }
    }
};

module.exports = resolvers