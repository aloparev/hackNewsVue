import {
  LOGIN,
  SIGNUP,
  UPVOTE_POST,
  DOWNVOTE_POST,
  DELETE_POST,
} from '@/graphql/mutations'
import { ALL_NEWS } from '@/graphql/queries'
import { SET_TOKEN, SET_USER } from '.'

export const state = () => ({
  token: null,
  currentUser: null, //TODO
})

export const getters = {
  isAuthenticated(state) {
    return !!state.token
  },
}

export const mutations = {
  async [SET_TOKEN](state, token) {
    state.token = token

    if (token) {
      await this.$apolloHelpers.onLogin(token)
    } else {
      await this.$apolloHelpers.onLogout()
    }
  },
  [SET_USER](state, user) {
    state.currentUser = user
  },
}

export const actions = {
  async login({ commit }, { email, password }) {
    const res = await this.app.apolloProvider.defaultClient.mutate({
      mutation: LOGIN,
      variables: { email, password },
    })

    const token = res.data.login
    await commit(SET_TOKEN, token)
  },
  async signup({ commit }, { name, email, password }) {
    const res = await this.app.apolloProvider.defaultClient.mutate({
      mutation: SIGNUP,
      variables: { name, email, password },
    })

    const token = res.data.signup
    await commit(SET_TOKEN, token)
  },
  async upvote(_, { id }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: UPVOTE_POST,
      variables: { id },
    })
  },
  async downvote(_, { id }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: DOWNVOTE_POST,
      variables: { id },
    })
  },
  async remove(_, { id }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: DELETE_POST,
      variables: { id },
      update: (store, { data }) => {
        const dataCache = store.readQuery({ query: ALL_NEWS })
        dataCache.posts = dataCache.posts.filter(
          (post) => post.id !== data.delete.id
        )
        store.writeQuery({ query: ALL_NEWS, data: dataCache })
      },
    })
  },
  async logout({ commit }) {
    await commit(SET_TOKEN, null)
  },
}
