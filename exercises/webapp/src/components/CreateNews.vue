<template>
  <form
    class="add-item"
    @submit.prevent="addNews"
  >
    <input
      v-model="title"
      type="text"
      placeholder="title"
    >
    <button
      type="submit"
      @click="addNews"
    >
      Create
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      title: "",
    };
  },
  methods: {
    addNews(e) {
      if (!this.title || this.title.trim() == "") {
        e.preventDefault();
      }

      this.$emit("add-news", { title: this.title, votes: 0 });
      this.title = "";
    },
  },
};
</script>

<style>
</style>
