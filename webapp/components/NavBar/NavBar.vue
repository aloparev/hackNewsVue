<template>
  <div class="nav-bar">
    <NuxtLink v-if="!isAuthenticated" to="/login">Login</NuxtLink>
    <a v-else type="button" @click="logout">Logout</a>
  </div>
</template>
<script>
export default {
  props:{
    isAuthenticated: {type:Boolean}
  },
  methods: {
    logout() {
      this.$emit('logout')
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
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #000000;
  border: none;
  transition: all .3s ease;
}
.nav-bar a:hover,
.nav-bar button:hover {
  box-shadow: 0px 0px 2px 2px #3500ea;
}
</style>
