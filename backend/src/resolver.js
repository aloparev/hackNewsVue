
const {writePost, upvotePost, downvotePost, deletePost, signup, login} = require('./utils')

module.exports = ([{ schema, executor }]) => ({
  Query: {
  },
  Person:{
    postCount: {
      selectionSet: '{ posts {id} }',
      resolve: (person) =>  person.posts.length
    }
  },
  Post:{
    votes: {
      selectionSet: '{ voters {value} }',
      resolve: (post) => post.voters.map(e => e.value).reduce((sum, e) => sum += e, 0)
    },
    authored:{
      selectionSet: '{ author {id} }',
      resolve: async (post, args, context) =>  {
        if(context.person){
          return context.person.id === post.author.id;
        }

        return false;
      }
    }
  },
  Mutation: {
    write: async (_, args, context, info) => {

      return await writePost(context.person.id, args, schema, executor, context, info);
    },
    upvote: async (_, args, context, info) => {

      return await upvotePost(context.person.id, args.id, schema, executor, context, info);
    },
    downvote: async (_, args, context, info) => {

      return await downvotePost(context.person.id, args.id, schema, executor, context, info);
    },
    delete: async (_, args, context, info) => {

      return await deletePost(context.person.id, args.id, schema, executor, context, info);
    },
    signup: async (_, args, context) => {

      return await signup(args, executor, context);
    },
    login: async (_, args, context) => {
      
      return await login(args, executor, context);
    }
  }
});
