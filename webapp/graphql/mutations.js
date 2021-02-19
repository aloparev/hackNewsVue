import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

export const SIGNUP = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password)
  }
`

export const WRITE_POST = gql`
  mutation($post: PostInput!) {
    write(post: $post) {
      id
      title
      votes
      authored
    }
  }
`

export const UPVOTE_POST = gql`
  mutation($id: ID!) {
    upvote(id: $id) {
      id
      title
      votes
      authored
    }
  }
`

export const DOWNVOTE_POST = gql`
  mutation($id: ID!) {
    downvote(id: $id) {
      id
      title
      votes
      authored
    }
  }
`

export const DELETE_POST = gql`
  mutation($id: ID!) {
    delete(id: $id) {
      id
      title
      votes
      authored
    }
  }
`
