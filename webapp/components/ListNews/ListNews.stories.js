import ListNews from './ListNews.vue'

export default {
  title: 'ListNews',
  component: ListNews,
  argTypes: { background: { control: 'color' } },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ListNews },
  template: '<ListNews v-bind="$props"/>',
})

export const NewsList = Template.bind({})
NewsList.args = {}
