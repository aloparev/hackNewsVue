import { createLocalVue, shallowMount } from '@vue/test-utils'
import LoginForm from './LoginForm.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LoginForm', () => {
  let actions
  let store

  const setupWrapper = () => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions
        },
      },
    })
    const stubs = { NuxtLink: true }
    return shallowMount(LoginForm, { store, localVue, stubs })
  }

    beforeEach(() => {
      actions = {
        login: jest.fn().mockResolvedValue(true),
      }
    })

    describe('form submit', () => {
    const login = async (wrapper) => {
      wrapper.find('#email').setValue('test@example.org')
      wrapper.find('#password').setValue('12345678')
      await wrapper.find('form').trigger('submit')
    }
  
      it('validates login', async () => {
        const wrapper = setupWrapper()
        await login(wrapper)
        expect(wrapper.find('.error-text').exists()).toBe(false)
      })
      describe('when credentials are wrong', () => {
        beforeEach(() => {
          actions.login = jest.fn().mockResolvedValue(false)
        })
  
        it('shows wrong credentials error', async () => {
          const wrapper = setupWrapper()
          await login(wrapper)
          await localVue.nextTick()
          expect(wrapper.find('.error-text').text()).toContain(
            'Wrong email/password combination'
          )
        })     
      })
    })
})
