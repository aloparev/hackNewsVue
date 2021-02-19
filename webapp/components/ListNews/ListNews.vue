<template>
  <div id="news-list-container">
    <div>
      <div class="list-header">
        <h1 class="list-title">News List</h1>
        <CreateNews />
      </div>
      <div v-if="$apollo.loading">
        <h2 id="loading-message">Loading...</h2>
      </div>
      <div v-else>
        <div v-if="posts.length == 0">
          <h1 id="error-message">The list is empty :(</h1>
        </div>
        <div v-else>
          <div class="news-counter">
            <p>
              News counter: <span> {{ newsCount }} </span>
            </p>
            <button id="sort-button" @click="reverseSort">sort asc/desc</button>
          </div>
          <div class="news-list">
            <News
              id="newsItems"
              v-for="item in sortedNews"
              :key="item.id"
              :news="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ALL_NEWS } from '@/graphql/queries'
import CreateNews from '@/components/CreateNews/CreateNews'
import News from '@/components/News/News'

export default {
  name: 'ListNews',
  components: {
    News,
    CreateNews,
  },
  data() {
    return {
      desc: true,
      posts: [],
    }
  },
  apollo: {
    posts: ALL_NEWS,
  },
  computed: {
    sortedNews() {
      const posts = [...this.posts]
      if (this.desc) {
        return posts.sort((x, y) => y.votes - x.votes)
      } else {
        return posts.sort((x, y) => x.votes - y.votes)
      }
    },
    newsCount() {
      return this.posts.length
    },
  },
  methods: {
    reverseSort() {
      this.desc = !this.desc
    },
  },
}
</script>

<style scoped>
#news-list-container {
  text-align: center;
  width: 100%;
}

.list-header {
  display: inline-grid;
  width: 100%;
  grid-template-columns: 20% 80%;
}

.list-title {
  text-align: left;
}

.news-counter {
  text-align: left;
  margin: 15px 0;
  display: inline-grid;
  width: 100%;
  grid-template-columns: 85% 15%;
}

.list-title::before {
  content: ' ';
  border-color: rgba(155, 132, 249, 0.58824);
  border-style: solid;
  border-width: 0 0.3em 0.25em 0;
  margin-right: 3px;
}

.news-list {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
  background: aliceblue;
  border-radius: 0 0 10px 10px;
}
</style>
