export default function ({ app, store }) {
  const token = app.$apolloHelpers.getToken()
  if (token) {
    store.commit('auth/setToken', token)
  } else {
    store.commit('auth/setToken', '')
  }
}
