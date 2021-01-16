export default function ({ app, redirect }) {
  if (app.$apolloHelpers.getToken()) {
    return redirect('/')
  }
}
