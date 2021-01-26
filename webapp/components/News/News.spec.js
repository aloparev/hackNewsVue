import { createLocalVue, shallowMount } from '@vue/test-utils'
import {
  UNKNOWN_ERROR,
  VOTE_UP_ALREADY,
  VOTE_DOWN_ALREADY,
  VOTE_ID_NOT_FOUND,
  DELETE_AUTHOR,
  AUTH_ERROR,
} from '@/static/error'
import { GraphQLError } from 'graphql'
import News from './News.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('News', () => {
  let actions
  const getters = {
    isAuthenticated: jest.fn().mockReturnValue(false), //not logged in
  }

  const setupWrapper = (data) => {
    const store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions,
          getters,
        },
      },
    })
    const stubs = { NuxtLink: true }
    return shallowMount(News, {
      store,
      localVue,
      propsData: {
        news: data,
      },
      stubs,
    })
  }

  beforeEach(() => {
    actions = {
      downvote: jest.fn().mockResolvedValue(true),
      upvote: jest.fn().mockResolvedValue(true),
      remove: jest.fn().mockResolvedValue(true),
    }
  })

  describe('Shows data', () => {
    const news = { id: 0, title: 'Item 1', votes: 1, authored: false }
    let wrapper

    it('show title and votes', () => {
      wrapper = setupWrapper(news)
      expect(wrapper.find('#news-title').text()).toEqual('Item 1')
      expect(wrapper.find('#news-votes').text()).toEqual('1')
    })

    describe('Not login', () => {
      beforeEach(() => {
        getters.isAuthenticated = () => false
        wrapper = setupWrapper(news)
      })

      it('Not show upvote, downvote buttons', () => {
        expect(wrapper.find('button#upvote').exists()).toEqual(false)
        expect(wrapper.find('button#downvote').exists()).toEqual(false)
      })

      it('Not show delete button', () => {
        expect(wrapper.find('button#delete').exists()).toEqual(false)
      })
    })

    describe('Logged in', () => {
      beforeEach(() => {
        getters.isAuthenticated = () => true
        wrapper = setupWrapper(news)
      })

      it('shows upvote, downvote buttons', () => {
        expect(wrapper.find('button#upvote').exists()).toEqual(true)
        expect(wrapper.find('button#downvote').exists()).toEqual(true)
      })

      it('not show delete button because not authored', () => {
        expect(wrapper.find('button#delete').exists()).toEqual(false)
      })

      it('shows delete button because authored', () => {
        news.authored = true
        wrapper = setupWrapper(news)
        expect(wrapper.find('button#delete').exists()).toEqual(true)
      })
    })
  })

  describe('Mutate', () => {
    const news = { id: 0, title: 'Item 1', votes: 1, authored: false }
    let wrapper
    beforeEach(() => {
      getters.isAuthenticated = () => true //login
    })

    describe('Upvote', () => {
      const upvote = async () => {
        wrapper = setupWrapper(news)
        await wrapper.find('button#upvote').trigger('click')
        await localVue.nextTick()
      }

      it('do upvote and no error', async () => {
        await upvote()
        expect(wrapper.find('.error-text').exists()).toBe(false)
      })

      it('checks upvoted already', async () => {
        actions.upvote = jest
          .fn()
          .mockRejectedValue(new GraphQLError(VOTE_UP_ALREADY))
        await upvote()
        expect(wrapper.find('.error-text').text()).toContain(VOTE_UP_ALREADY)
      })

      it('checks post not exist', async () => {
        actions.upvote = jest
          .fn()
          .mockRejectedValue(new GraphQLError(VOTE_ID_NOT_FOUND))
        await upvote()
        expect(wrapper.find('.error-text').text()).toContain(VOTE_ID_NOT_FOUND)
      })

      it('checks user not exist', async () => {
        actions.upvote = jest
          .fn()
          .mockRejectedValue(new GraphQLError(AUTH_ERROR))
        await upvote()
        expect(wrapper.find('.error-text').text()).toContain(AUTH_ERROR)
      })

      it('checks other error', async () => {
        actions.upvote = jest.fn().mockRejectedValue(new Error('Any error'))
        await upvote()
        expect(wrapper.find('.error-text').text()).toContain(UNKNOWN_ERROR)
      })
    })

    describe('Downvote', () => {
      const downvote = async () => {
        wrapper = setupWrapper(news)
        await wrapper.find('button#downvote').trigger('click')
        await localVue.nextTick()
      }

      it('do downvote and no error', async () => {
        await downvote()
        expect(wrapper.find('.error-text').exists()).toBe(false)
      })

      it('checks downvoted already', async () => {
        actions.downvote = jest
          .fn()
          .mockRejectedValue(new GraphQLError(VOTE_DOWN_ALREADY))
        await downvote()
        expect(wrapper.find('.error-text').text()).toContain(VOTE_DOWN_ALREADY)
      })

      it('checks post not exist', async () => {
        actions.downvote = jest
          .fn()
          .mockRejectedValue(new GraphQLError(VOTE_ID_NOT_FOUND))
        await downvote()
        expect(wrapper.find('.error-text').text()).toContain(VOTE_ID_NOT_FOUND)
      })

      it('checks user not exist', async () => {
        actions.downvote = jest
          .fn()
          .mockRejectedValue(new GraphQLError(AUTH_ERROR))
        await downvote()
        expect(wrapper.find('.error-text').text()).toContain(AUTH_ERROR)
      })

      it('checks other error', async () => {
        actions.downvote = jest.fn().mockRejectedValue(new Error('Any error'))
        await downvote()
        expect(wrapper.find('.error-text').text()).toContain(UNKNOWN_ERROR)
      })
    })

    describe('Delete', () => {
      const remove = async () => {
        news.authored = true //to show the delete button
        wrapper = setupWrapper(news)
        await wrapper.find('button#delete').trigger('click')
        await localVue.nextTick()
      }

      it('do remove and no error', async () => {
        await remove()
        expect(wrapper.find('.error-text').exists()).toBe(false)
      })

      it('checks can not remove if not author', async () => {
        actions.remove = jest
          .fn()
          .mockRejectedValue(new GraphQLError(DELETE_AUTHOR))
        await remove()
        expect(wrapper.find('.error-text').text()).toContain(DELETE_AUTHOR)
      })

      it('checks other error', async () => {
        actions.remove = jest.fn().mockRejectedValue(new Error('Any error'))
        await remove()
        expect(wrapper.find('.error-text').text()).toContain(UNKNOWN_ERROR)
      })
    })
  })
})
