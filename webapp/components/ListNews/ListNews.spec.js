import { createLocalVue, shallowMount  } from '@vue/test-utils'
import News from '../News/News.vue'
import ListNews from './ListNews.vue'
import Vuex from 'vuex'
require('regenerator-runtime/runtime')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ListNews', () => {
  let actions
  let getters
  let store
  const setupWrapper = (data) => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions,
          getters,
        },
      },
    })
    const stubs = { NuxtLink: true }
    return shallowMount(ListNews, {
      store,
      localVue,
      propsData: {
        posts: data
      },
      stubs
    })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => false,
    }
    actions = {
      signup: jest.fn(),
    }
  })

  
  describe('given empty list', () => {

    it('should display "The list is empty :(" if newsList contains no items', () => {
      const wrapper = setupWrapper([])
 

      const paragraph = wrapper.find('#error-message')

      expect(paragraph.text()).toEqual('The list is empty :(')
    })
  })

  it('should display default news in list', async() => {
    const wrapper = setupWrapper([
      { id: 0, title: 'Item 1', votes: 1, authored: false },
      { id: 1, title: 'Item 2', votes: 0, authored: true }
    ])
    await wrapper.vm.$nextTick()

    const news = wrapper.findAllComponents(News)
    expect(news).toHaveLength(2)
  })

  it('should toggle between ascending and descending order', async () => {
    const wrapper = mount(ListNews, {
      data() {
        return {
          newsList: [
            { id: 0, title: 'Just', votes: 3 },
            { id: 1, title: 'VueJS', votes: 1 },
            { id: 2, title: 'Rocks', votes: 2 },
          ],
          desc: true,
        }
      },
    })

    // sorting to ascending
    const sortButton = wrapper.find('button')
    await sortButton.trigger('click')
    let news = wrapper.findAllComponents(News)
    expect(news.at(0).text()).toContain(1)

    // sorting to descending
    await sortButton.trigger('click')
    news = wrapper.findAllComponents(News)
    expect(news.at(0).text()).toContain(3)
  })
})
