<template>
  <div>
    <h2>{{ news.title }} ({{ news.votes }})</h2>
    <div class="list-action-btn">
      <button class="upvote" @click="updateItem(1)">Upvote</button>
      <button class="downvote" @click="updateItem(-1)">Downvote</button>
      <button class="delete" @click="deleteItem">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "News",
  props: {
    news: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    deleteItem: function () {
      this.$emit("delete-news");
    },
    updateItem(value) {
      this.$emit("update", { ...this.news, votes: this.news.votes + value });
    },
  },
};
</script>
