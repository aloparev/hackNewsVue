<template>
  <div id="news-list-container">
    <div>
      <h1>News List</h1>
      <div v-if="$apollo.loading">
        <h2>Loading...</h2>
      </div>
      <div v-else>
        <div v-if="posts.length == 0">
          <h1 id="error-message">The list is empty :(</h1>
        </div>
        <div v-else>
          <p>
            News counter: <span> {{ newsCount }} </span>
          </p>
          <button @click="reverseSort">sort asc/desc</button>
          <div class="news-list">
            <news
              v-for="item in sortedNews"
              :key="item.id"
              :news="item"
              @delete-news="deleteNews(item.id)"
              @update="update"
            />
          </div>
        </div>
        <create-news @add-news="addNews" />
      </div>
    </div>
  </div>
</template>

<script>
import News from "../News/News";
import CreateNews from "../CreatNews/CreateNews";
import gql from "graphql-tag";

export default {
  name: "ListNews",
  data() {
    return {
      desc: true,
    };
  },
  components: {
    News,
    CreateNews,
  },
  apollo: {
    posts: gql`
      query newsList {
        posts {
          id
          title
          votes
        }
      }
    `,
  },
  methods: {
    deleteNews(id) {
      this.posts = [...this.posts.filter((e) => e.id !== id)];
    },
    addNews(newNews) {
      if (this.posts.findIndex((e) => e.id == newNews.id) == -1) {
        this.posts.push({ ...newNews });
      }
    },
    update(news) {
      this.posts.find((e) => e.id == news.id).votes = news.votes;
    },
    reverseSort() {
      this.desc = !this.desc;
    },
  },
  computed: {
    sortedNews() {
      let posts = [...this.posts];
      if (this.desc) return posts.sort((x, y) => y.votes - x.votes);
      else return posts.sort((x, y) => x.votes - y.votes);
    },
    newsCount() {
      return this.posts.length;
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
