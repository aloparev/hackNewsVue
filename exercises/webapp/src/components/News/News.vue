<template>
  <div>
    <h2>{{ news.title }} ({{ news.votes }})</h2>
    <div class="list-action-btn">
      <button aria-label="Upvote" @click="updateItem(1)">Upvote</button>
      <button aria-label="Downvote" @click="updateItem(-1)">Downvote</button>
      <button aria-label="Remove" @click="deleteItem">Remove</button>
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
