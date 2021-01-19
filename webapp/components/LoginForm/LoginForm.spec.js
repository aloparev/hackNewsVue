import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { UNKNOWN_ERROR, LOGIN_FAILED } from '@/static/error'
import { GraphQLError } from 'graphql'
import LoginForm from './LoginForm.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LoginForm.vue', () => {
  let actions
  let getters
  let store

  const setupWrapper = () => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            currentUser: null,
            token: null,
          }),
          actions,
          getters,
        },
      },
    })
    const stubs = { NuxtLink: true }
    return shallowMount(LoginForm, { store, localVue, stubs })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => false,
    }
    actions = {
      login: jest.fn(),
    }
  })

  describe('form submit', () => {
    const login = async (wrapper) => {
      wrapper.find('input#email').setValue('testuser@gmail.com')
      wrapper.find('input#password').setValue('12345678')
      await wrapper.find('form').trigger('submit')
    }

    it('shows no error', async () => {
      const wrapper = setupWrapper()
      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('.error-text').exists()).toBe(false)
    })

    describe('when credentials are wrong', () => {
      beforeEach(() => {
        actions.login = jest
          .fn()
          .mockRejectedValue(new GraphQLError(LOGIN_FAILED))
      })

      it('shows wrong credentitals error', async () => {
        const wrapper = setupWrapper()
        await login(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error-text').text()).toContain(LOGIN_FAILED)
      })
    })

    describe('in case of any other error', () => {
      beforeEach(() => {
        actions.login = jest
          .fn()
          .mockRejectedValue(new Error('Any other Error'))
      })

      it('shows wrong credentitals error', async () => {
        const wrapper = setupWrapper()
        await login(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error-text').text()).toContain(UNKNOWN_ERROR)
      })
    })
  })
})
