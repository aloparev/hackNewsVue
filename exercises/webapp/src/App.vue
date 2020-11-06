<template>
  <div id="app">
    <list-news />
  </div>
</template>

<script>
import ListNews from "./components/ListNews/ListNews";

export default {
  name: "app",
  components: {
    ListNews,
  },
};
</script>
<style>
#app {
  font-family: "Avenir", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 500px;
  margin: auto;
  max-height: 300px;
}
</style>
