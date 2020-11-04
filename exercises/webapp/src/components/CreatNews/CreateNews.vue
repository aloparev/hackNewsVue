<template>
  <form @submit.prevent="addNews" class="add-item">
    <input type="text" v-model="title" placeholder="title" />
    <button type="submit" @click="addNews">Create</button>
  </form>
</template>

<script>
export default {
  name: "News",
  data() {
    return {
      title: "",
    };
  },
  methods: {
    addNews() {
      if (!this.title || this.title.trim() == "") {
        return;
      }

      this.$emit("add-news", { title: this.title, votes: 0 });
      this.title = "";
    },
  },
};
</script>
