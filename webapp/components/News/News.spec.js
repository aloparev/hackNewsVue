import { mount,createLocalVue } from '@vue/test-utils'
import News from './News.vue'
import Vuex from 'vuex'
require('regenerator-runtime/runtime')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('News', () => {
  let actions
  let getters
  let store
  let wrapper

  const setupWrapper = (data) => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            token: '',
          }),
          actions,
          getters,
        },
      },
    })
    const stubs = { NuxtLink: true }
    return mount(News, {
      store,
      localVue,
      propsData: {
        news: data
      },
      stubs
    })
  }

  const findReturnVal = async (buttonName) => {
    const button = wrapper.find('#'+buttonName)
    await button.trigger('click')
    return wrapper
  }

  const examplePost = { id: 90, title: 'TestPost', votes: 0, authored: true }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => true,
    }
    actions = {
      login: jest.fn().mockResolvedValue(true),
    }
    wrapper = setupWrapper(examplePost)
  })

  it('should correctly emit when the delete button is clicked', async () => {
    await findReturnVal('delete')
    setTimeout(() => {
      expect(wrapper.emitted('update')).toBeTruthy()
      const newsHeader = wrapper.find('h2')
      expect(newsHeader.text()).toBeNull
    }, 2000)

  })

  it('should correctly increment votes when the upvote button is clicked', async () => {
      await findReturnVal('upvote')
    setTimeout(() => {
      expect(wrapper.emitted('update')).toBeTruthy()
      const newsHeader = wrapper.find('h2')
      expect(newsHeader.text()).toContain(1)
    }, 2000)
  })

  it('should correctly decrease votes when the downvote button is clicked', async () => {
    await findReturnVal('downvote')
    setTimeout(() => {
      expect(wrapper.emitted('update')).toBeTruthy()
      const newsHeader = wrapper.find('h2')
      expect(newsHeader.text()).toContain(-1)
    }, 2000)
  })
})
