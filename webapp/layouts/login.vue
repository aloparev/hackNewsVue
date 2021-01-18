<template>
  <div id="app">
    <h3 class="title">The Country Roads</h3>
    <Nuxt />
  </div>
</template>
<script>
export default {
  middleware: 'isAuth',
}
</script>
<style scoped>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

#app {
  text-align: center;
  padding-top: 5%;
}

body {
  background: #f0f8ff;
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
  width: 350px;
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
  background: #b5e0ff;
  padding: 10px;
  margin-bottom: 20px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
