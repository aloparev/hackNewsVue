import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NavBar from './NavBar.vue'

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
            token: 'fake_token',
          }),
          actions,
          getters,
        },
      },
    })
    const stubs = { NuxtLink: true }
    return shallowMount(NavBar, { store, localVue, stubs })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => false,
    }
  })

  it('should show login button', async () => {
    const wrapper = setupWrapper()
    const navBar = wrapper.find('.nav-bar')
    expect(navBar.text()).toContain('Login')

  })

  it('should show logout button', async () => {
    getters.isAuthenticated = jest.fn().mockResolvedValue(true)
    const wrapper = setupWrapper()
    const navBar = wrapper.find('.nav-bar')
    expect(navBar.text()).toContain('Logout')

  })
})
