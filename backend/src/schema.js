const {gql } = require('apollo-server');

const typeDefs = gql`
type Post {
  id: ID!
  title: String!
  votes: Int!
  author: User!
  voters:[User]
}

type User {
  name: ID!
  posts: [Post]
}

type Query {
  posts: [Post]
  users: [User]
}

type Mutation {
  write(post: PostInput!): Post
  # delete(id: ID!): Post
  upvote(id: ID!, voter: UserInput!): Post
  # downvote(id: ID!, voter: UserInput!): Post
}

input PostInput {
  title: String!
  author: UserInput!
}

input UserInput {
  name: String!
}
`;

module.exports = typeDefs