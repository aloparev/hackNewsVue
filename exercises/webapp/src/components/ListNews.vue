<template>
  <div>
    <div class="list-item">
      <h1>News List</h1>
      <news
        v-for="item in getSortedNews"
        :key="item.id"
        :news="item"
        @deleteNews="deleteNews(item.id)"
      />
    </div>
    <create-news @addNews="addNews" />
  </div>
</template>
 
<script>
import News from "./News.vue";
import CreateNews from "./CreateNews.vue";

export default {
  name: "ListNews",
  components: {
    News,
    CreateNews,
  },
  data() {
    return {
      list: [
        { id: 0, title: "Just", votes: 0 },
        { id: 1, title: "VueJS", votes: 0 },
        { id: 2, title: "Rocks", votes: 0 },
      ],
    };
  },
  computed: {
    sortedNews() {
      let newList = [...this.list];
      return newList.sort((x, y) => y.votes - x.votes);
    },
  },
  methods: {
    deleteNews: function (id) {
      this.list = this.list.filter((e) => e.id !== id);
    },
    addNews: function (newNews) {
      let id = Math.max(...this.list.map((e) => e.id), 0);
      id++;

      // create new object from old one and overwrite id value
      this.list.push({ ...newNews, id: id });
    },
  },
};
</script>

<style>
</style>
