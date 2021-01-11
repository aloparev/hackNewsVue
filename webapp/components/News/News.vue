<template>
  <div>
    <h2>{{ news.title }} ({{ news.votes }})</h2>
    <div>
      <button class="upvote" @click="upvote">Upvote</button>
      <button class="downvote" @click="downvote">Downvote</button>
      <button class="delete" @click="deleteItem">Remove</button>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
require('regenerator-runtime/runtime')
export default {
  name: 'News',
  props: {
    news: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentUser: { name: 'TestUser' },
    }
  },
  methods: {
    async deleteItem() {
      try {
        const response = await this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: ID!) {
                delete(id: $id) {
                  title
                }
              }
            `,
            variables: {
              id: this.news.id,
            },
          })
          .catch(console.error)

        console.log(response.data.delete)
        this.$emit('delete-news')
      } catch {
        throw new Error("Mutation 'delete' failed!")
      }
    },
    async upvote() {
      try {
        const response = await this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: ID!, $voter: UserInput!) {
                upvote(id: $id, voter: $voter) {
                  title
                  votes
                  voters {
                    name
                  }
                }
              }
            `,
            variables: {
              id: this.news.id,
              voter: this.currentUser,
            },
          })
          .catch(console.error)

        console.log(response.data.upvote)
        this.$emit('update', {
          ...this.news,
          votes: response.data.upvote.votes,
        })
      } catch {
        throw new Error("Mutation 'upvote' failed!")
      }
    },
    async downvote() {
      try {
        const response = await this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: ID!, $voter: UserInput!) {
                downvote(id: $id, voter: $voter) {
                  title
                  votes
                  voters {
                    name
                  }
                }
              }
            `,
            variables: {
              id: this.news.id,
              voter: this.currentUser,
            },
          })
          .catch(console.error)

        console.log(response.data.downvote)
        this.$emit('update', {
          ...this.news,
          votes: response.data.downvote.votes,
        })
      } catch {
        throw new Error("Mutation 'downvote' failed!")
      }
    },
  },
}
</script>
