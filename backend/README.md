# BACKEND

## Setup

``` bash
# setup
yarn install

# lint
yarn lint

# run test
yarn test

# start server at localhost:4000
yarn start

```

## Guide

<h4>The Server ready at http://localhost:4000 </h4>

<h4>✔️ Example for 'indefinitely' nestable queries.</h4>

```
{
  posts {
    title
    author {
      name
      posts {
        title
        author {
          name
        }
      }
    }
  }
}
```

<h4>✔️ Example for 'Create a new Post' queries.</h4>

```
mutation {
  write(post: { title: "the countryroads", author: { name: "Andrej" } }) {
    id
    title
    author {
      name
    }
  }
}
```

<h4>✔️ Example for 'Upvote' queries.</h4>

```
mutation {
  upvote(id: 0, voter: { name: "Andrej" }) {
    id
    title
    votes
    voters {
      name
      posts {
        title
      }
    }
  }
}
```