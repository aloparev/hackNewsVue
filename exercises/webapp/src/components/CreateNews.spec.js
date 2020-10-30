import CreateNews from './CreateNews.vue';

describe('App', () => {
    // Inspect the raw component options
    it('has data', () => {
      expect(typeof CreateNews.data).toBe('function')
    })
  });