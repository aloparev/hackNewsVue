<template>
  <div>
    <h2>{{ news.title }} ({{ news.votes }})</h2>
    <div>
      <button class="upvote" @click="updateItem(1)">Upvote</button>
      <button class="downvote" @click="updateItem(-1)">Downvote</button>
      <button class="delete" @click="deleteItem">Remove</button>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
require("regenerator-runtime/runtime");
export default {
  name: "News",
  props: {
    news: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async deleteItem() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($id: ID!) {
              delete(id: $id) {
                title
              }
            }
          `,
          variables: {
            id: this.news.id,
          },
        });

        this.$emit("delete-news");
      } catch {
        throw new Error("Mutation 'delete' failed!");
      }
    },
    updateItem(value) {
      this.$emit("update", { ...this.news, votes: this.news.votes + value });
    },
  },
};
</script>
