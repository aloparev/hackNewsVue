<template>
  <div class="news-item">
    <h2>{{ news.title }}</h2>
    <h4>{{ news.votes }}</h4>
    <div v-if="isAuthenticated" style="text-align: left">
      <button @click="upvote" v-if="isAuthenticated">Upvote</button>
      <button @click="downvote" v-if="isAuthenticated">Downvote</button>
      <button v-if="news.authored" @click="edit">Edit</button>
      <button v-if="news.authored" @click="remove">Remove</button>
    </div>
  </div>
</template>

<script>
// import jwt_decode from 'jwt-decode'
import { mapGetters, mapState } from 'vuex'

import { UPVOTE_POST, DOWNVOTE_POST, DELETE_POST } from '@/graphql/mutations'
import { ALL_NEWS } from '@/graphql/queries'

export default {
  name: 'News',
  props: {
    news: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('auth', ['token']),
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    async upvote() {
      await this.$apollo.mutate({
        mutation: UPVOTE_POST,
        variables: {
          id: this.news.id,
        },
      })
    },
    async downvote() {
      await this.$apollo.mutate({
        mutation: DOWNVOTE_POST,
        variables: {
          id: this.news.id,
        },
      })
    },
    edit() {
      // TODO
    },
    async remove() {
      await this.$apollo.mutate({
        mutation: DELETE_POST,
        variables: {
          id: this.news.id,
        },
        update: (store, { data }) => {
          const dataCache = store.readQuery({ query: ALL_NEWS })
          dataCache.posts = dataCache.posts.filter(
            (post) => post.id !== data.delete.id
          )
          store.writeQuery({ query: ALL_NEWS, data: dataCache })
        },
      })
    },
  },
}
</script>
<style scoped>
.news-item {
  padding: 10px;
  display: inline-grid;
  grid-template-columns: 60% 10% 30%;
  width: 100%;
}
h2 {
  text-align: left;
}
</style>
