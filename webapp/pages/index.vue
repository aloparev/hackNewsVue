<template>
  <div id="app">
    <NavBar :isAuthenticated="isAuthenticated" @logout="logout" />
    <h3 class="title">The Country Roads</h3>
    <div class="container">
      <ListNews :isAuthenticated="isAuthenticated" />
    </div>
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
      this.isAuthenticated = false
      await this.$apolloHelpers.onLogout()
      this.$store.commit('auth/setToken', '')
      this.$router.push({ path: '/' })
    },
  },
}
</script>
<style>
body {
  background: #f0f8ff;
}

#app {
  text-align: center;
  padding-top: 5%;
}

.container {
  margin: 0 auto;
  align-items: center;
  text-align: center;
  padding: 20px;
  max-height: 800px;
  margin-top: 10px;
  box-shadow: 0px 0px 4px 4px gray;
  border-radius: 10px;
  background: #fff;
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
  background: #9b84f996;
  padding: 10px;
  margin-bottom: 20px;
}
</style>
