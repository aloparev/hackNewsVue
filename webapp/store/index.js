const cookieparser = require('cookieparser')

export const actions = {
    nuxtServerInit(store, { ssrContext  }) {
        const { cookie } = ssrContext.req.headers
        if (!cookie) {
            store.commit('auth/setToken', '')
            return
        }
        const parsed = cookieparser.parse(cookie)
        store.commit('auth/setToken', parsed['apollo-token'])
    },
}