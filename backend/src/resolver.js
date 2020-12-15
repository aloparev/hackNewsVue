const { delegateToSchema } = require('@graphql-tools/delegate');
const executor = require('./graphCms/executor');
const bcrypt = require('bcrypt');
const {UserInputError} = require('apollo-server');

module.exports = ({ subschema }) => ({
  Query: {
  },
  Person:{
    postCount: {
      selectionSet: '{ posts {id} }',
      resolve: (person) =>  person.posts.length
    }
  },
  Post:{
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
    write: async (parent, args, context) => {
      //TODO
      return null;
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

      const checkEmailquery = `{
        person(where:{email:"${email}"}){
          id
        }
      }`;
      const {data:{person}} = await executor(checkEmailquery);
      console.log("Person has same email:", person)

      if(!person) {
          
          const createQuery = `
            mutation{
              createPerson(data: {name:"${name}", email:"${email}",password:"${bcrypt.hashSync(password, 10)}"}){
                id
              }
            }
          `;

          const {data:{createPerson}} = await executor(createQuery)
          console.log("Created Person: ",createPerson)

          // //publish Person
          // const publishQuery = `
          //   mutation{
          //     publishPerson(where:{id:"${createPerson.id}"}, to: PUBLISHED){
          //       id
          //     }
          //   }
          // `;

          // const {data: {publishPerson}} = await executor(publishQuery)
          // console.log("Published Person",publishPerson)
          
          if(createPerson) {
            return context.jwtSign({ person: { id: createPerson.id } })
          }

      }else {
        return new UserInputError("Email already exists")
      }

      return null;
      
    },
    login: async (parent, args, context, info) => {
      const { email, password } = args;
      const query = `{
          person(where:{email:"${email}"}){
            id
            password
          }
      }`;
      const {data:{person}} = await executor(query)
      
      if(bcrypt.compareSync(password, person.password)) {
        return context.jwtSign({ person: { id: person.id } })
      }

      return null;
    }
  }
});
