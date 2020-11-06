<template>
  <form @submit.prevent="addNews" class="add-item">
    <input
      type="text"
      aria-label="Search"
      v-model="title"
      placeholder="title"
    />
    <button type="submit" :disabled="!title.length > 0" @click="addNews">
      Create
    </button>
    <p class="error-text">{{ error_message }}</p>
  </form>
</template>

<script>
export default {
  name: "CreateNews",
  data() {
    return {
      title: "",
      error_message: "",
    };
  },
  methods: {
    addNews() {
      if (!this.title || this.title.trim() == "") {
        this.error_message = "Create failed! Title cannot be empty!";
      } else {
        this.$emit("add-news", { title: this.title, votes: 0 });
        this.error_message = "";
      }

      this.title = "";
    },
  },
};
</script>

<style scoped>
.error-text {
  color: red;
}
</style>
