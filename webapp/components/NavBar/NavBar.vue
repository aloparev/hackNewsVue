<template>
  <div class="nav-bar">
    <NuxtLink v-if="!isAuthenticated" to="/login">Login</NuxtLink>
    <a v-else type="button" @click="exit">Logout</a>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async exit() {
      await this.logout()
    },
  },
}
</script>
<style scoped>
.nav-bar {
  width: 100%;
  text-align: right;
  margin: auto;
  padding: 20px 0;
  width: 1000px;
}

.nav-bar a,
.nav-bar button {
  background: #17dbef;
  padding: 10px 50px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #000000;
  border: none;
  transition: all 0.3s ease;
}
.nav-bar a:hover,
.nav-bar button:hover {
  box-shadow: 0px 0px 2px 2px #3500ea;
}
</style>
