<template>
  <div>
    <div v-if="sortedNews.length == 0">
      <h1>The list is empty :(</h1>
    </div>
    <div v-else class="list-item">
      <h1>News List</h1>
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
      asc: 1,
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
    reverseSort: function () {
      this.asc *= -1;
      // console.log('reverseSort');
    },
  },
  computed: {
    sortedNews() {
      let newList = [...this.newsList];
      if (this.asc == 1) return newList.sort((x, y) => y.votes - x.votes);
      else return newList.sort((x, y) => x.votes - y.votes);
    },
    newsCount() {
      return this.newsList.length || 0;
    },
  },
};
</script>
