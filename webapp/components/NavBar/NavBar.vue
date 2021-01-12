<template>
  <div class="nav-bar">
    <NuxtLink v-if="!isAuthenticated" to="/login"> Login </NuxtLink>
    <button v-else type="button" @click="logout">Logout</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAuthenticated: false,
    }
  },
  mounted() {
    this.isAuthenticated = !!this.$apolloHelpers.getToken()
  },
  methods: {
    async logout() {
      await this.$apolloHelpers.onLogout()
      this.$store.commit('auth/setToken', '')
      this.isAuthenticated = false
    },
  },
}
</script>
<style scoped>
.nav-bar {
  width: 100%;
  text-align: right;
  margin: auto;
  padding: 10px 0;
  width: 1000px;
}

.nav-bar a,
.nav-bar button {
  background: #17dbef;
  padding: 5px 50px;
  border-radius: 2px;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #000000;
}
</style>
