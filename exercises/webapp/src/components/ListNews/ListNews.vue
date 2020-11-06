<template>
  <div id="news-list-container">
    <div class="news-list">
      <h1>News List</h1>
      <div v-if="newsList.length == 0">
        <h1 id="error-message">The list is empty :(</h1>
      </div>
      <div v-else>
        <p>
          News counter: <span> {{ newsCount }} </span>
        </p>
        <button @click="reverseSort">sort asc/desc</button>
        <news
          v-for="item in sortedNews"
          :key="item.id"
          v-bind:news="item"
          @delete-news="deleteNews(item.id)"
          @update="update"
        />
      </div>
    </div>
    <create-news @add-news="addNews" />
  </div>
</template>

<script>
import News from "../News/News";
import CreateNews from "../CreatNews/CreateNews";

export default {
  name: "ListNews",
  data() {
    return {
      desc: true,
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
    deleteNews(id) {
      this.newsList = this.newsList.filter((e) => e.id !== id);
    },
    addNews(newNews) {
      let id = Math.max(...this.newsList.map((e) => e.id), 0);
      id++;

      // create new object from old one and overwrite id value
      this.newsList.push({ ...newNews, id: id });
    },
    update(news) {
      this.newsList.find((e) => e.id == news.id).votes = news.votes;
    },
    reverseSort() {
      this.desc = !this.desc;
    },
  },
  computed: {
    sortedNews() {
      let newList = [...this.newsList];
      if (this.desc) return newList.sort((x, y) => y.votes - x.votes);
      else return newList.sort((x, y) => x.votes - y.votes);
    },
    newsCount() {
      return this.newsList.length;
    },
  },
};
</script>

<style scoped>
#news-list-container {
  text-align: center;
}

.news-list {
  max-height: 580px;
  overflow-y: auto;
  margin-bottom: 40px;
}
</style>
