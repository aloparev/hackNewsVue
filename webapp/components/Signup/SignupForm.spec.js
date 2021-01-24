import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { UNKNOWN_ERROR, EMAIL_EXIST, PASSWORT_SHORT } from '@/static/error'
import { GraphQLError } from 'graphql'
import SignupForm from './SignupForm.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SignupForm', () => {
  let actions
  let getters
  let store

  const setupWrapper = () => {
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
    return shallowMount(SignupForm, { store, localVue, stubs })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => false,
    }
    actions = {
      signup: jest.fn(),
    }
  })

  describe('form submit', () => {
    const signup = async (wrapper) => {
      wrapper.find('input#name').setValue('Test User')
      wrapper.find('input#email').setValue('testuser@gmail.com')
      wrapper.find('input#password').setValue('12345678')
      await wrapper.find('form').trigger('submit')
    }

    it('shows no error', async () => {
      const wrapper = setupWrapper()
      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('.error-text').exists()).toBe(false)
    })

    describe('when register are wrong', () => {
      it('shows password short error', async () => {
        actions.signup = jest
          .fn()
          .mockRejectedValue(new GraphQLError(PASSWORT_SHORT))
        const wrapper = setupWrapper()
        await signup(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error-text').text()).toContain(PASSWORT_SHORT)
      })

      it('shows email exist error', async () => {
        actions.signup = jest
          .fn()
          .mockRejectedValue(new GraphQLError(EMAIL_EXIST))
        const wrapper = setupWrapper()
        await signup(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error-text').text()).toContain(EMAIL_EXIST)
      })
    })

    describe('in case of any other error', () => {
      beforeEach(() => {
        actions.signup = jest
          .fn()
          .mockRejectedValue(new Error('Any other Error'))
      })

      it('shows wrong credentitals error', async () => {
        const wrapper = setupWrapper()
        await signup(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error-text').text()).toContain(UNKNOWN_ERROR)
      })
    })
  })
})
