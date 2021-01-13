export default async function ({ store, redirect }) {

    let hasLogin = !!store.app.$apolloHelpers.getToken()

    if (store.state.auth.token) {//check token in SSR
        if(!hasLogin) {
            await store.app.$apolloHelpers.onLogin(store.state.auth.token)
            hasLogin = true;
        }
    }

    if(hasLogin) {
        return redirect('/') //return home when logged in
    }
}