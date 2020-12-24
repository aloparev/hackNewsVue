const { gql } = require('apollo-server')

const typeDefs = gql`

  type Mutation {
    write(post: PostInput!): Post
    upvote(id: ID!): Post
    downvote(id: ID!): Post
    delete(id: ID!): Post
    login(email: String!, password: String!): String
    signup(name: String!, email: String!, password: String!): String
  }

  extend type Person {
    postCount: Int
  }
  
  input PostInput {
    title: String!
  }

  extend type Post {
    votes: Int
    authored: Boolean
  }
`

module.exports = typeDefs
