import { mount } from '@vue/test-utils';
import CreateNews from 'CreateNews.vue';

const emptyTitle = "";

describe('App', () => {
    // Inspect the raw component options
    it('has data', () => {
      expect(typeof CreateNews.data).toBe('function')
    })
  });