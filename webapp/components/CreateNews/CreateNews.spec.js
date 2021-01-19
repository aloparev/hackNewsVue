import { describe, expect, it } from '@jest/globals'
import { mount } from '@vue/test-utils'
import CreateNews from './CreateNews.vue'
require('regenerator-runtime/runtime')

describe('CreateNews', () => {
  it('should return default empty title', () => {
    const wrapper = mount(CreateNews)
    const button = wrapper.find('button')
    button.trigger('click')
    expect(wrapper.title).toEqual()
  })

  it('should cover correct emit of component', async () => {
    const wrapper = mount(CreateNews, {
      data() {
        return {
          title: 'TestTitle',
        }
      },
    })
    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('add-news')).toBeTruthy()
  })
})
