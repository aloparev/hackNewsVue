import { mount, createLocalVue } from '@vue/test-utils'
import CreateNews from './CreateNews.vue'
import Vuex from 'vuex'
require('regenerator-runtime/runtime')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CreateNews', () => {
  let actions
  let getters
  let store

  const setupWrapper = (data) => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUser: null,
            token: null,
          }),
          actions,
          getters,
        },
      },
    })
    return mount(CreateNews, {
      store,
      localVue,
      propsData: {
        news: data
      },
    })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => true,
    }
  })

  it('should return default empty title', async () => {
    const wrapper = setupWrapper({ title:''})
    const button = wrapper.find('button')
    await button.trigger('click')
    setTimeout(() => {
      expect(wrapper.title).toBeNull()
    }, 2000)
  })

  it('should cover correct emit of component', async () => {
    const wrapper = setupWrapper({ title:'Test'})
    const button = wrapper.find('button')
    await button.trigger('click')
    setTimeout(() => {
      expect(wrapper.emitted('update')).toBeTruthy()
    }, 2000)
  })
})
