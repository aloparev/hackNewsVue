import { createLocalVue, mount  } from '@vue/test-utils'
import News from '../News/News.vue'
import ListNews from './ListNews.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import { createMockClient } from "mock-apollo-client";
import VueApollo from 'vue-apollo'
import { ALL_NEWS } from '@/graphql/queries'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueApollo);

const postListMock = {
  data: {
      posts: [
          {
              id: "1",
              title: "Vue",
              votes: 4,
              authored: false,
              author: {
                __typename: "User",
                id: "3",
            },
              __typename: "Post",
          },
          {
              id: "2",
              title: "React",
              votes: 0,
              authored: false,
              author: {
                __typename: "User",
                id: "3",
            },
              __typename: "Post",
          },
          {
              id: "3",
              title: "TDD",
              votes: 2,
              authored: false,
              author: {
                __typename: "User",
                id: "3",
            },
              __typename: "Post",
          },
      ],
  },
};

describe('ListNews', () => {
  let mockClient;
  let apolloProvider;
  let requestHandlers;
  let wrapper;
  let getters;
  let store;

  const setupWrapper = (passed) => {
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUser: null,
            token: null,
          }),
          getters,
        },
      },
    })
    mockClient = createMockClient({
      resolvers: {},
  });
  requestHandlers = {
      allPostsQueryHandler: jest.fn().mockResolvedValue({ ...postListMock }),
      ...passed,
  };
  mockClient.setRequestHandler(ALL_NEWS, requestHandlers.allPostsQueryHandler);
  apolloProvider = new VueApollo({ defaultClient: mockClient });
    wrapper= mount(ListNews, {
      store,
            localVue,
            apolloProvider,
    })
  }

  beforeEach(() => {
    getters = {
      isAuthenticated: () => true,
    }
  })

  afterEach(() => {
    wrapper.destroy();
    mockClient = null;
    apolloProvider = null;
});


  
  describe('given empty list', () => {

    it("renders a Vue component", () => {
      setupWrapper();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.vm.$apollo.queries.posts).toBeTruthy();
  });

    it('should display "The list is empty :(" if newsList contains no items', async () => {
      setupWrapper({
        allPostsQueryHandler: jest.fn().mockResolvedValue({ data: { posts: [] } }),
    });
    await wrapper.vm.$nextTick();
      const paragraph = wrapper.find('#error-message')
      expect(paragraph.text()).toEqual('The list is empty :(')
    })
  })

/*   it('should display added news in list', async() => {
    setupWrapper();
    wrapper.setData(postListMock)
    await Vue.nextTick()
    let news = wrapper.findAllComponents(News)
    console.log('child', news)
    expect(wrapper.findAllComponents(News).wrappers.map(w => w.find('h2').text())).toContain(["Vue", "TDD", "React"]); 
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
  }) */
})
