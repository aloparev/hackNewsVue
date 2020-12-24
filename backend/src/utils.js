const {UserInputError, AuthenticationError, gql} = require('apollo-server');
const { delegateToSchema } = require('@graphql-tools/delegate');

//check user exist
const checkUserExist = async (userId, executor) => {
  let document  = gql`
  query ($id: ID!) {
    person(where:{id: $id}){
      id
    }
  }`;

  let response = await executor({ document, variables: {id: userId } });
  if (response.errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }
  
  return !!response.data.person;
}

//check post exist
const checkPostExist = async (postId, executor) => {
  let document  = gql`
  query ($id: ID!) {
    post(where:{id: $id}){
      id
    }
  }`;

  let response = await executor({ document, variables: {id: postId } });
  if (response.errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }
  
  return !!response.data.post;
}

//check post exist
const checkEmailExist = async (email, executor) => {
  let document  = gql`
  query ($email: String!) {
    person(where:{email: $email}){
      id
    }
  }`;

  let response = await executor({ document, variables: {email: email } });

  if (response.errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }

  return !!response.data.person;
}

const mayVote = async(userId, postId, executor) => {
  
  //get the list voters of User
  const document  = gql`
  query ($id: ID!) {
    person(where:{id:$id}){
      voters{
        post {
          id
        }
      }
    }
  }`;

  const { data, errors } = await executor({ document, variables: { id: userId} });
  
  if (errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }
  
  const { person } = data;

  if(person){
    const voter = person.voters.find(e => e.post.id === postId)
    return voter == null;
  }

  return false;
}

//val = 1 or -1
const votePost = async(userId, postId, val, schema, executor, context, info) => {
  
  if(!await checkUserExist(userId, executor)) { //user is not exist?
    throw new AuthenticationError("Sorry, your credentials are wrong!");
  }

  if(!await checkPostExist(postId, executor)) { //post is not exist?
    throw new UserInputError("No post with this ID found.");
  }

  if(!await mayVote(userId, postId, executor)) {
    throw new UserInputError("This user voted on that post already.");
  }

  const param = { 
    data:{
      person:{
        connect: {id:userId}
      },
      post:{
        connect:{id:postId}
      },
      value: val
    }
  }
  
  let document = gql`
  mutation ($data: VoterCreateInput!) {
    createVoter(data: $data) {
      id
    }
  }
  `;
  
  const { data, errors }  = await executor({ document, variables : {data: param.data} });
  
  if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
  
  if (data.createVoter) {
  
    const votedPost = await delegateToSchema({
      schema,
      operation: 'query',
      fieldName: 'post',
      args: {
        where: { id: postId },
      },
      context,
      info
    });
  
    return votedPost;
  }
  
  return null;
}


const writePost = async(userId, args, schema, executor, context, info) => {
  if(!await checkUserExist(userId, executor)) { //user is not exist
    throw new AuthenticationError("Sorry, your credentials are wrong!");
  }

  //write post
  const {post} = args

  //create Voter
  const param = { 
    data: {
      title: post.title,
      author: { 
        connect : { id : userId}
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
}

module.exports = { checkEmailExist , votePost, writePost }