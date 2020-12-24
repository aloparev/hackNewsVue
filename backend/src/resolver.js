const { delegateToSchema } = require('@graphql-tools/delegate');
const bcrypt = require('bcrypt');
const {UserInputError, AuthenticationError, gql} = require('apollo-server');

//check user exist
const checkUserExist = async (userId, executor) => {
  let document  = gql`
  query ($id: ID!) {
    person(where:{id: $id}){
      id
    }
  }`;

  let response = await executor({ document, variables: {id: userId } });
  if (response.errors)
    return false;
  
  return !!response.data.person;
} 

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
      resolve: (post) => post.voters.map(e => e.value).reduce((sum, e) => sum+=e)
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
    write: async (parent, args, context, info) => {

      if(!await checkUserExist(context.person.id, executor)) { //user is not exist
        throw new UserInputError("Sorry, your credentials are wrong!");
      }

      //write post
      const {post} = args
      const param = { 
        data: {
          title: post.title,
          author: { 
            connect : { id : context.person.id }
          }
        }
      }

      const createPost = await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'createPost',
        args: param,
        context,
        info
      });

      return createPost;
    },
    upvote: async (parent, args, context) => {
      //TODO
      return null;
    },
    downvote: async (parent, args, context) => {
      //TODO
      return null;
    },
    delete: async (parent, args, context) => {
      //TODO
      return null;
    },
    signup: async (parent, args, context) => {
      const { name, email, password } = args;

      //check email exist
      let document  = gql`
        query ($email: String!) {
          person(where:{email:$email}){
            id
          }
        }`;

      let response = await executor({ document, variables: { email } });
      if (response.errors) throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
      const { person } = response.data;

      if (!person) {

        //insert the new person in database
        document = gql`
        mutation ($name: String!, $email: String!, $password: String!) {
          createPerson(data: {name: $name, email: $email, password: $password}) {
            id
          }
        }
        `;

        const passwordHash = bcrypt.hashSync(password, 10);
        response = await executor({ document, variables : { name, email, password: passwordHash} });

        if (response.errors) throw new UserInputError(response.errors.map((e) => e.message).join('\n'));

        return context.jwtSign({ person: { id: response.data.createPerson.id } });
      } 

      throw new UserInputError("Email already exist");
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
