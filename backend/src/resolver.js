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
        return posts.filter(e => e.author.name == parent.name);
      }
    },
    Mutation: {
      write: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.createPost(args.post);
      },
      upvote: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.votePost(args.id, 1);
      },
      downvote: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.votePost(args.id, -1);
      },
      delete: async (parent, args, context) => {
        return await context.dataSources.postsDataSrc.deletePost(args.id);
      },
      signup: async (parent, args, context) => {
        return await context.dataSources.usersDataSrc.signup(args.name, args.email, args.password);
      },
      login: async (parent, args, context) => {
        return await context.dataSources.usersDataSrc.login(args.email, args.password);
      }
    }
};

module.exports = resolvers