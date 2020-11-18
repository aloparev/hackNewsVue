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
  </form>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "CreateNews",
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

      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation($post: PostInput!) {
              write(post: $post) {
                title
                author {
                  name
                }
              }
            }
          `,
          // Parameters
          variables: {
            post: {
              title: this.title,
              author: { name: "TestUser" },
            },
          },
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
      this.$emit("add-news", { title: this.title, votes: 0 });
      this.title = "";
    },
  },
};
</script>
