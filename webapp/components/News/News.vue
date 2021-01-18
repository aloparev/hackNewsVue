<template>
  <div class="news-item">
    <h2>{{ news.title }}</h2>
    <h4>{{ news.votes }}</h4>
    <div v-if="isAuthenticated" style="text-align: left">
      <button @click="upvote">Upvote</button>
      <button @click="downvote">Downvote</button>
      <button v-if="isAuthor" @click="edit">Edit</button>
      <button v-if="isAuthor" @click="remove">Remove</button>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import { mapGetters, mapState } from 'vuex'

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
    isAuthor() {
      return (
        this.isAuthenticated &&
        this.news.author.id === jwt_decode(this.token).id
      )
    },
  },
  methods: {
    upvote() {
      // TODO
    },
    downvote() {
      // TODO
    },
    edit() {
      // TODO
    },
    remove() {
      // TODO
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
