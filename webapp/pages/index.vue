<template>
  <div class="container">
    <h1 class="title">The Country Roads</h1>
    <list-news />
  </div>
</template>

<script>
import ListNews from '../components/ListNews/ListNews.vue'
export default {
  components: { ListNews },
}
</script>

<style>
body {
  background: #c5c5c5;
}

.container {
  margin: 0 auto;
  align-items: center;
  text-align: center;
  padding: 50px;
  max-height: 800px;
  margin-top: 7%;
  box-shadow: 0 0 10px 10px #9e9e9e;
  border-radius: 10px;
  background: #fff;
  width: 1440px;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
