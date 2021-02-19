import { mount, createLocalVue } from '@vue/test-utils'
import CreateNews from './CreateNews.vue'
import Vuex from 'vuex'
import Vue from 'vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CreateNews', () => {
  let actions
  let getters
  let store

  const setupWrapper = (options) => {
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
      ...options,
    })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => true,
    }
  })

  it('should be disabled for an empty title', async () => {
    const wrapper = setupWrapper()
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBe('disabled')
  })

  it('should not trigger on empty input', async () => {
    const wrapper = setupWrapper({ attachToDocument: true })
    const addNews = jest.fn()
    wrapper.find('input').setValue('')
    await Vue.nextTick()
    wrapper.setMethods({ addNews })
    const button = wrapper.find('[type=submit]')
    button.trigger('click')
    await Vue.nextTick()
    expect(addNews).toHaveBeenCalledTimes(0)
  })

  it('should trigger submit method on input', async () => {
    const wrapper = setupWrapper({ attachToDocument: true })
    const addNews = jest.fn()
    wrapper.find('input').setValue('Test Title')
    await Vue.nextTick()
    wrapper.setMethods({ addNews })
    const button = wrapper.find('[type=submit]')
    button.trigger('click')
    await Vue.nextTick()
    expect(addNews).toHaveBeenCalledTimes(1)
  })
})
