const {UserInputError, AuthenticationError, gql} = require('apollo-server');
const { delegateToSchema } = require('@graphql-tools/delegate');
const bcrypt = require('bcrypt');

const login = async(args, executor, context) => {
  const document  = gql`
    query ($email: String!) {
      person(where:{email:$email}){
        id
        password
      }
    }`;

  const { email, password } = args;
  const { data, errors } = await executor({ document, variables: { email, password } });
  
  if (errors) {
    throw new UserInputError(errors.map((e) => e.message).join('\n'));
  }

  const { person } = data;

  if(person && bcrypt.compareSync(password, person.password)) {
      return context.jwtSign({ person: { id: person.id } })
  }

  throw new AuthenticationError('Wrong email/password combination');
}

const signup = async(args, executor, context) => {
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

  if (response.errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }

  return context.jwtSign({ person: { id: response.data.createPerson.id } });
}

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

const checkEmailExist = async (email, executor) => {
  
  let document  = gql`
  query {
    people{
      id
      email
    }
  }`;

  let response = await executor({ document, variables: {} });

  if (response.errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }

  person = response.data.people.find(e => e.email == email);

  return !!person;
}

const mayVote = async(userId, postId, executor) => {
  
  //get the list voters of User
  const document  = gql`
  query ($userId: ID!, $postId: ID!) {
    voters(where: {person: {id: $userId}, post: {id: $postId}}) {
      id
    }
  }`;

  const { data, errors } = await executor({ document, variables: { userId: userId, postId: postId} });
  
  if (errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }
  
  const { voters } = data;

  return voters != null && voters.length == 0;
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

const mayDelete = async(userId, postId, executor) => {
  
  //get the Post with user id and post id to check author
  const document  = gql`
  query ($userId: ID!, $postId: ID!) {
    posts(where: {author: {id: $userId}, id: $postId}) {
      id
    }
  }`;

  const { data, errors } = await executor({ document, variables: { userId: userId, postId: postId } });
  
  if (errors) {
    throw new UserInputError(response.errors.map((e) => e.message).join('\n'));
  }
  
  const { posts } = data;

  return posts != null && posts.length > 0; // length == 1
}

const deletePost = async(userId, postId, schema, executor, context, info) => {
  if(!await checkUserExist(userId, executor)) { //user is not exist
    throw new AuthenticationError("Sorry, your credentials are wrong!");
  }

  if(!await mayDelete(userId, postId, executor)) { //check author
    throw new UserInputError("Only the author of the post may delete the post.");
  }

  //delete the list Voters of the Post
  const document  = gql`
  mutation ($postId: ID!) {
    deleteManyVoters(where: {post: {id: $postId}}) {
      count
    }
  }`;

  const {errors} = await executor({ document, variables: { userId: userId, postId: postId} });
  
  if (errors) {
    throw new UserInputError(errors.map((e) => e.message).join('\n'));
  }

  const deletedPost = await delegateToSchema({
    schema,
    operation: 'mutation',
    fieldName: 'deletePost',
    args: {
      where:{id: postId}
    },
    context,
    info
  });

  //how can we do rollback (restore the deleted voters)? if we meet errors in deleting the post
  return deletedPost;
}

module.exports = {votePost, writePost, deletePost, signup, login}