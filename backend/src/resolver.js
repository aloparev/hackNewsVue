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
      const posts = await context.dataSources.postsDataSrc.allPosts()
      return posts.filter(e => e.author.id === parent.id)
    }
  },
  Post: {
    votes: async (parent, args, context) => {
      return parent.getVotes()
    }
  },
  Mutation: {
    write: async (parent, args, context) => {
      return await context.dataSources.postsDataSrc.createPost(args.post)
    },
    upvote: async (parent, args, context) => {
      return await context.dataSources.postsDataSrc.votePost(args.id, 1)
    },
    downvote: async (parent, args, context) => {
      return await context.dataSources.postsDataSrc.votePost(args.id, -1)
    },
    delete: async (parent, args, context) => {
      return await context.dataSources.postsDataSrc.deletePost(args.id)
    },
    signup: async (parent, args, context) => {
      return await context.dataSources.usersDataSrc.signup(args.name, args.email, args.password)
    },
    login: async (parent, args, context) => {
      return await context.dataSources.usersDataSrc.login(args.email, args.password)
    }
  }
}

module.exports = resolvers
