import { createLocalVue, shallowMount } from '@vue/test-utils'
import ListNews from '@/components/ListNews/ListNews.vue'
import News from '@/components/News/News.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ListNews', () => {
  let actions
  let getters
  let store
  const setupWrapper = (loading, data) => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions,
          getters,
        },
      },
    })
    const stubs = { NuxtLink: true, News: News }
    return shallowMount(ListNews, {
      store,
      localVue,
      mocks: {
        $apollo: {
          loading: loading,
        },
      },
      data: () => data,
      stubs,
    })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => false,
    }
  })
  const data = { posts: [], desc: true }

  it('Page loading', () => {
    const wrapper = setupWrapper(true, data)
    const loading = wrapper.find('#loading-message')
    expect(loading.text()).toEqual('Loading...')
  })

  describe('shows list', () => {
    it('display message "The list is empty :(" if newsList contains no items', () => {
      const wrapper = setupWrapper(false, data)
      const emptyMessage = wrapper.find('#error-message')
      expect(emptyMessage.text()).toEqual('The list is empty :(')
    })

    it('display news list', () => {
      data.posts = [
        { id: 0, title: 'Item 1', votes: 3, authored: false },
        { id: 1, title: 'Item 2', votes: 1, authored: true },
      ]
      const wrapper = setupWrapper(false, data)
      const news = wrapper.findAllComponents(News)
      expect(news).toHaveLength(2)
    })

    describe('sorts List', () => {
      beforeEach(() => {
        data.posts = [
          { id: 0, title: 'Item 1', votes: 3, authored: false },
          { id: 1, title: 'Item 2', votes: 1, authored: true },
          { id: 2, title: 'Item 3', votes: 2, authored: true },
        ]
      })

      it('should descending', () => {
        const wrapper = setupWrapper(false, data)
        const news = wrapper.findAll('.news-item')
        expect(news.at(0).find('h4').text()).toEqual('3')
        expect(news.at(1).find('h4').text()).toEqual('2')
        expect(news.at(2).find('h4').text()).toEqual('1')
      })

      it('should ascending', () => {
        data.desc = false
        const wrapper = setupWrapper(false, data)
        const news = wrapper.findAll('.news-item')
        expect(news.at(0).find('h4').text()).toEqual('1')
        expect(news.at(1).find('h4').text()).toEqual('2')
        expect(news.at(2).find('h4').text()).toEqual('3')
      })

      it('should toggle between ascending and descending order', async () => {
        data.desc = false
        const wrapper = setupWrapper(false, data)
        const sortButton = wrapper.find('button')
        await sortButton.trigger('click')
        let news = wrapper.findAll('.news-item')
        expect(news.at(0).find('h4').text()).toEqual('3')

        // sorting to ascending
        await sortButton.trigger('click')
        news = wrapper.findAll('.news-item')
        expect(news.at(0).find('h4').text()).toEqual('1')
      })
    })
  })
})
