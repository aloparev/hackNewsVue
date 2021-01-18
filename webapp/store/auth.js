import { SET_TOKEN, SET_USER } from '.'

export const state = () => ({
  token: null,
  currentUser: null,
})

export const getters = {
  isAuthenticated(state) {
    return !!state.token
  },
}

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token
  },
  [SET_USER](state, token) {
    state.token = token
  },
}

export const actions = {
  async login({ commit }, token) {
    commit(SET_TOKEN, token)
    await this.$apolloHelpers.onLogin(token)
  },
  async logout({ commit }) {
    commit(SET_TOKEN, null)
    await this.$apolloHelpers.onLogout()
  },
}
