const resolvers = {
    Query: {
      posts: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.allPosts();
      },
      users: async (parent, args, context) => {
        return await context.dataSources.usersDataSrc.allUsers();
      }
    },
    User: {
      posts: async (parent, args, context) => {
        let posts = await context.dataSources.postsDataSrc.allPosts();
        return posts.filter(e => e.author.id == parent.id);
      }
    },
    Mutation: {
      write: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.createPost(args.post, context.currUser);
      },
      upvote: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.votePost(args.id, 1, context.currUser);
      },
      downvote: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.votePost(args.id, -1, context.currUser);
      },
      delete: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.deletePost(args.id, context.currUser);
      },
      signup: async (parent, args, context) => {
        return await context.dataSources.usersDataSrc.signup(args.name, args.email, args.password, context.jwt);
      },
      login: async (parent, args, context) => {
        return await context.dataSources.usersDataSrc.login(args.email, args.password, context.jwt);
      }
    }
};

module.exports = resolvers