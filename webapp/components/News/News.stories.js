import { action } from '@storybook/addon-actions'
import News from './News.vue'

export default {
  title: 'News',
  component: News,
  argTypes: { background: { control: 'color' } },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { News },
  template:
    '<News @update="updateItem" @delete-news="deleteItem" v-bind="$props" />',
  methods: { updateItem: action('clicked'), deleteItem: action('clicked') },
})

export const NewsItem = Template.bind({})
NewsItem.args = {
  news: {
    id: 0,
    title: 'Example',
    votes: 3,
  },
  background: '#e00',
}
