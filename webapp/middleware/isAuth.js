export default async function ({ app, redirect }) {
  const token = app.$apolloHelpers.getToken()
  if (token) {
    await app.store.commit('auth/SET_TOKEN', token)
    return redirect('/')
  }
}
