<template>
  <div class="news-item">
    <div>
      <h2 id="news-title">{{ news.title }}</h2>
      <div v-if="error" class="error-text">
        <small>{{ error.message }}</small>
      </div>
      <div v-if="loading" class="loading-text">
        <small
          ><img class="loader" src="~/assets/img/loader.gif" />
          Loading...</small
        >
      </div>
    </div>
    <h4 id="news-votes">{{ news.votes }}</h4>
    <div v-if="isAuthenticated" style="text-align: left">
      <button id="upvote" @click="doUpvote">Upvote</button>
      <button id="downvote" @click="doDownvote">Downvote</button>
      <button v-if="news.authored" @click="doEdit">Edit</button>
      <button id="delete" v-if="news.authored" @click="doRemove">Remove</button>
    </div>
  </div>
</template>

<script>
// import jwt_decode from 'jwt-decode'
import { mapActions, mapGetters, mapState } from 'vuex'
import { UNKNOWN_ERROR, VOTE_ERRORS, DELETE_ERRORS } from '@/static/error'

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
      error: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('auth', ['token']),
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('auth', ['upvote', 'downvote', 'remove']),
    async doAction(action, param, errors) {
      if (this.loading) return
      try {
        this.loading = true
        this.error = null

        //do upvote, downvote, delete
        await action(param)
      } catch (ex) {
        let message = ex.message.replace('GraphQL error:', ' ').trim()
        if (!errors.includes(message)) {
          message = UNKNOWN_ERROR
        }
        this.error = { message }
      } finally {
        this.loading = false
      }
    },
    async doUpvote() {
      await this.doAction(this.upvote, { id: this.news.id }, VOTE_ERRORS)
    },
    async doDownvote() {
      await this.doAction(this.downvote, { id: this.news.id }, VOTE_ERRORS)
    },
    async doEdit() {
      // TODO
    },
    async doRemove() {
      await this.doAction(this.remove, { id: this.news.id }, DELETE_ERRORS)
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

.error-text {
  color: red;
  text-align: left;
}

.loading-text {
  color: #00b9ff;
  text-align: left;
}

.loader {
  width: 20px;
}
</style>
