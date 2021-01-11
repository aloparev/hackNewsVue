<template>
  <form class="add-item" @submit.prevent="addNews">
    <input
      v-model="title"
      type="text"
      aria-label="Search"
      placeholder="title"
    />
    <button type="submit" :disabled="!title.length > 0">Create</button>
  </form>
</template>

<script>
import gql from 'graphql-tag'
require('regenerator-runtime/runtime')

export default {
  name: 'CreateNews',
  data() {
    return {
      title: '',
      currentUser: { name: 'TestUser' },
    }
  },
  methods: {
    async addNews() {
      if (!this.title || this.title.trim() === '') {
        return
      }
      try {
        const response = await this.$apollo
          .mutate({
            mutation: gql`
              mutation($post: PostInput!) {
                write(post: $post) {
                  id
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
                author: this.currentUser,
              },
            },
          })
          .catch(console.error)

        console.log(response.data.write)
        this.$emit('add-news', {
          id: response.data.write.id,
          title: response.data.write.title,
          votes: 0,
        })

        this.title = ''
      } catch {
        throw new Error("Mutation 'write' failed!")
      }
    },
  },
}
</script>
