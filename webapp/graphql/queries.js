import gql from 'graphql-tag'

export const ALL_NEWS = gql`
  query newsList {
    posts {
      id
      title
      votes
      authored
    }
  }
`
