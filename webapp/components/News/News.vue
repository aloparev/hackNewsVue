<template>
  <div class="news-item">
    <h2>{{ news.title }}</h2>
    <h4>{{ news.votes }}</h4>
    <div v-if="isAuthenticated" style="text-align:left">
      <button class="upvote" @click="upvote" >Upvote</button>
      <button class="downvote" @click="downvote">Downvote</button>
      <button class="delete" @click="deleteItem" v-if="isAuthor()">Remove</button>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import jwt_decode from 'jwt-decode'
require('regenerator-runtime/runtime')

export default {
  name: 'News',
  props: {
    news: {
      type: Object,
      required: true,
    },
    isAuthenticated: {
      type:Boolean
    }
  },
  data() {
    return {
      currentUser: { name: 'TestUser' },
    }
  },
  methods: {
    isAuthor(){
      if(this.isAuthenticated){
        return this.news.author.id === jwt_decode(this.$apolloHelpers.getToken()).id
      }

      return false
    },
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
<style scoped>
.news-item {
  padding: 10px;
  display: inline-grid;
  grid-template-columns: 60% 15% 25%;
  width: 100%;
}
h2 {
  text-align: left;
}
</style>
