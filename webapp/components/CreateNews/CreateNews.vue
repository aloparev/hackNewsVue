<template>
  <form v-if="isAuthenticated" class="add-item" @submit.prevent="addNews">
    <input
      v-model="title"
      type="text"
      aria-label="Search"
      placeholder="title"
      class="add-input"
    />
    <button class="add-button" type="submit" :disabled="!title.length > 0">
      CREATE
    </button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

import { WRITE_POST } from '@/graphql/mutations'
import { ALL_NEWS } from '@/graphql/queries'
require('regenerator-runtime/runtime')

export default {
  name: 'CreateNews',
  data() {
    return {
      title: '',
      currentUser: { name: 'TestUser' },
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    async addNews() {
      if (!this.title || this.title.trim() === '') {
        return
      }
      try {
        await this.$apollo.mutate({
          mutation: WRITE_POST,
          variables: {
            post: {
              title: this.title,
            },
          },
          update: (store, { data: { write } }) => {
            const data = store.readQuery({ query: ALL_NEWS })
            data.posts.push(write)
            store.writeQuery({ query: ALL_NEWS, data })
          },
        })
        this.title = ''
      } catch {
        throw new Error("Mutation 'write' failed!")
      }
    },
  },
}
</script>
<style scoped>
.add-item {
  display: inline-grid;
  width: 100%;
  grid-template-columns: 80% 20%;
}

.add-input:focus,
.add-input {
  outline: none;
}

.add-input {
  height: 40px;
  width: 100%;
  background: rgb(155 132 249 / 0.3);
  padding: 0px 20px;
  border-radius: 5px 0 0 5px;
  border: none;
}

.add-button:disabled {
  background: rgb(16 16 16 / 0.3);
  color: rgb(16 16 16 / 0.3);
  cursor: no-drop;
}

.add-button {
  border-radius: 0 5px 5px 0;
  height: 40px;
  border: none;
  background: rgb(148 122 255);
  color: white;
}
</style>
