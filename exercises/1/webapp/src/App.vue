<template>
  <div id="app">
    <list-news v-bind:list="list" />
  </div>
</template>

<script>
import ListNews from './components/ListNews.vue';

export default {
  name: 'app',
  data () {
    return {
      list:[
        {id:0, title:"Just", vote:0},
        {id:1, title:"VueJS", vote:0},
        {id:2, title:"Rocks", vote:0}
      ]
    }
  },
  components:{
    ListNews
  }
}
</script>
<style>

  #app {
    font-family: 'Avenir', Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color:#2c3e50;
    width:500px;
    margin:auto;
    text-align: center;
    max-height: 300px;
  }

  .list-item {
    max-height: 600px;
    overflow-y: auto;
  }

  .list-action-btn {
    display: flex;
    justify-content: center;
    margin-top:10px;
  }

  .add-item  {
    margin-top:50px;
    display:flex;
    justify-content: center;
  }

</style>