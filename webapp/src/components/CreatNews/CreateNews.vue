<template>
  <form @submit.prevent="addNews" class="add-item">
    <input
      type="text"
      aria-label="Search"
      v-model="title"
      placeholder="title"
    />
    <button type="submit" :disabled="!title.length > 0">Create</button>
  </form>
</template>

<script>
import gql from "graphql-tag";
require("regenerator-runtime/runtime");
export default {
  name: "CreateNews",
  data() {
    return {
      title: "",
    };
  },
  methods: {
    async addNews() {
      if (!this.title || this.title.trim() == "") {
        return;
      }
      try {
        const response = await this.$apollo.mutate({
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
          variables: {
            post: {
              title: this.title,
              author: { name: "TestUser" },
            },
          },
        });
        console.log(response.data.write.title);
        this.$emit("add-news", { title: response.data.write.title, votes: 0 });
        this.title = "";
      } catch {
        throw new Error("Mutation 'write' failed!");
      }
    },
  },
};
</script>
