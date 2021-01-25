import { mount, createLocalVue } from '@vue/test-utils'
import News from './News.vue'
import Vuex from 'vuex'
import Vue from 'vue'
require('regenerator-runtime/runtime')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('News', () => {
  let actions
  let getters
  let store
  let wrapper

  const examplePost = { id: 90, title: 'TestPost', votes: 0, authored: true }

  const setupWrapper = (options) => {
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
        news: examplePost,
      },
      stubs,
      ...options,
    })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => true,
    }
    actions = {
      login: jest.fn().mockResolvedValue(true),
    }
    wrapper = setupWrapper({ attachToDocument: true })
  })

  it('should correctly trigger when the delete button is clicked', async () => {
    const remove = jest.fn()
    wrapper.setMethods({ remove })
    const button = wrapper.find('#delete')
    button.trigger('click')
    await Vue.nextTick()
    expect(remove).toHaveBeenCalledTimes(1)
  })

  it('should correctly trigger when the upvote button is clicked', async () => {
    const upvote = jest.fn()
    wrapper.setMethods({ upvote })
    const button = wrapper.find('#upvote')
    button.trigger('click')
    await Vue.nextTick()
    expect(upvote).toHaveBeenCalledTimes(1)
  })

  it('should correctly trigger when the downvote button is clicked', async () => {
    const downvote = jest.fn()
    wrapper.setMethods({ downvote })
    const button = wrapper.find('#downvote')
    button.trigger('click')
    await Vue.nextTick()
    expect(downvote).toHaveBeenCalledTimes(1)
  })
})
