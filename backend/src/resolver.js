const bcrypt = require('bcrypt');
const {UserInputError, AuthenticationError, gql} = require('apollo-server');
const {writePost, checkEmailExist, votePost} = require('./utils')

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
      resolve: async (post, args, context, info) =>  {
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

      return await votePost(context.person.id, args.id, 1, schema, executor, context, info);
    },
    downvote: async (_, args, context, info) => {

      return await votePost(context.person.id, args.id, -1 , schema, executor, context, info);
    },
    delete: async (_, args, context) => {
      //TODO
      return null;
    },
    signup: async (_, args, context) => {
      const { name, email, password } = args;

      if (await checkEmailExist(email, executor)) {
        throw new UserInputError("Email already exist");
      }

      //insert the new user in database
      let document = gql`
      mutation ($name: String!, $email: String!, $password: String!) {
        createPerson(data: {name: $name, email: $email, password: $password}) {
          id
        }
      }
      `;

      const passwordHash = bcrypt.hashSync(password, 10);
      let response = await executor({ document, variables : { name, email, password: passwordHash} });

      if (response.errors) throw new UserInputError(response.errors.map((e) => e.message).join('\n'));

      return context.jwtSign({ person: { id: response.data.createPerson.id } });
    },
    login: async (parent, args, context, info) => {
      
      const document  = gql`
        query ($email: String!) {
          person(where:{email:$email}){
            id
            password
          }
        }`;

      const { email, password } = args;
      const { data, errors } = await executor({ document, variables: { email, password } });
      if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
      const { person } = data;
      if(person && bcrypt.compareSync(password, person.password)) {
          return context.jwtSign({ person: { id: person.id } })
      }

      throw new AuthenticationError('Wrong email/password combination');
    }
  }
});
