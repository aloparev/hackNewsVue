const {UserInputError, AuthenticationError, gql} = require('apollo-server');
const { delegateToSchema } = require('@graphql-tools/delegate');
const bcrypt = require('bcrypt');

const NEW_VOTE = 0
const VOTE_AGAIN = 1
const NOT_ALLOWED_VOTE = -1

const login = async(args, executor, context) => {
  const document  = gql`
    query{
      people {
        id
        email
        password
      }
    }`;

  const { email, password } = args;
  const { data, errors } = await executor({ document, variables: {} });
  
  if (errors) {
    throw new UserInputError(errors.map((e) => e.message).join('\n'));
  }

  let person = data.people.find(e => e.email == email);

  if(person && bcrypt.compareSync(password, person.password)) {
      return context.jwtSign({ person: { id: person.id } })
  }

  throw new AuthenticationError('Wrong email/password combination');
}

const signup = async(args, executor, context) => {
  let { name, email, password } = args;

  if (await checkEmailExist(email, executor)) {
    throw new UserInputError("Email already exist");
  }

  password = password.trim();
  if(password.length < 8){
    throw new UserInputError("Accept only passwords with a length of at least 8 characters")
  }
  const passwordHash = bcrypt.hashSync(password, 10);

  //insert the new user in database
  let document = gql`
  mutation ($name: String!, $email: String!, $password: String!) {
    createPerson(data: {name: $name, email: $email, password: $password}) {
      id
    }
  }
  `;

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

  let person = response.data.people.find(e => e.email == email);

  return !!person;
}

/**
 * @param val is either -1 or 1.if -1 is downvote, otherwise upvote 
 */
const mayVote = async(userId, postId, val, executor) => {
  
  //get the list voters of User
  const document  = gql`
  query ($userId: ID!, $postId: ID!) {
    voters(where: {person: {id: $userId}, post: {id: $postId}}) {
      id
      value
    }
  }`;

  const { data, errors } = await executor({ document, variables: { userId: userId, postId: postId} });
  
  if (errors) {
    throw new UserInputError(errors);
  }
  
  const { voters } = data;
  let voteType = NEW_VOTE
  let voterId = null

  if(voters) {
    if(voters.length > 0) { // User already has voted (max length = 1)
      if(voters[0].value === val) {
        voteType = NOT_ALLOWED_VOTE;
      } else {
        voteType = VOTE_AGAIN; //user is allowed vote again.
        voterId = voters[0].id
      }
    }
  }

  return { voteType, voterId }
}

const upvotePost = async(userId, postId, schema, executor, context, info) => {
  return await votePost(userId, postId, 1, schema, executor, context, info)
}

const downvotePost = async(userId, postId, schema, executor, context, info) => {
  return await votePost(userId, postId, -1, schema, executor, context, info)
}

const votePost = async(userId, postId, val, schema, executor, context, info) => {
  
  if(!await checkUserExist(userId, executor)) { //user is not exist?
    throw new AuthenticationError("Sorry, your credentials are wrong!");
  }

  if(!await checkPostExist(postId, executor)) { //post is not exist?
    throw new UserInputError("No post with this ID found.");
  }

  const { voteType, voterId } = await mayVote(userId, postId, val, executor)
  
  if(voteType === NOT_ALLOWED_VOTE) {
    throw new UserInputError("This user voted on that post already.");
  }
  
  let variables = {}
  let document = null

  if(voteType === VOTE_AGAIN && voterId) {

    variables = { 
      data:{
        value: val
      },
      where: {
        id: voterId
      }
    }

    document = gql`
      mutation ($data: VoterUpdateInput!, $where: VoterWhereUniqueInput!) {
        updateVoter(data: $data, where: $where) {
          id
        }
      }
    `;
    
  } else { //NEW_VOTE
    variables = { 
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
    
    document = gql`
      mutation ($data: VoterCreateInput!) {
        createVoter(data: $data) {
          id
        }
      }
    `;
  }
  const { data, errors }  = await executor({ document, variables });
  
  if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
  
  if (data.createVoter || data.updateVoter) {
  
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

const checkForExistingPost= async(userId, postId,value, executor ) => {

  const param = { 
    data:{
      person:{
        connect: {id:userId}
      },
      post:{
        connect:{id:postId}
      },
      value
    }
  }

  let document = gql`
  mutation ($data: VoterCreateInput!) {
    createVoter(data: $data) {
      id
    }
  }
  `;
   const { data, errors } = await executor({ document, variables : {data: param.data} });
if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
const { createVoter } = data;
return createVoter != null && createVoter.length == 0;

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
    throw new UserInputError(errors);
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

module.exports = {upvotePost, downvotePost, writePost, deletePost, signup, login}