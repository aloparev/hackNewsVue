<template>
  <div>
    <div v-if="sortedNews.length == 0">
      <h1>The list is empty :(</h1>
    </div>
    <div v-else class="list-item">
      <h1>News List</h1>
      <news
        v-for="item in sortedNews"
        :key="item.id"
        v-bind:news="item"
        @deleteNews="deleteNews(item.id)"
        @update="update"
      />
    </div>
    <create-news @addNews="addNews" />
  </div>
</template>

<script>
import News from "../News/News";
import CreateNews from "../CreatNews/CreateNews";

export default {
  name: "ListNews",
  data() {
    return {
      newsList: [
        { id: 0, title: "Just", votes: 0 },
        { id: 1, title: "VueJS", votes: 0 },
        { id: 2, title: "Rocks", votes: 0 },
      ],
    };
  },
  components: {
    News,
    CreateNews,
  },
  methods: {
    deleteNews: function (id) {
      this.newsList = this.newsList.filter((e) => e.id !== id);
    },
    addNews: function (newNews) {
      let id = Math.max(...this.newsList.map((e) => e.id), 0);
      id++;

      // create new object from old one and overwrite id value
      this.newsList.push({ ...newNews, id: id });
    },
    update: function (news) {
      this.newsList.find((e) => e.id == news.id).votes = news.votes;
    },
  },
  computed: {
    sortedNews() {
      let newsList = [...this.newsList];
      return newsList.sort((x, y) => y.votes - x.votes);
    },
  },
};
</script>
