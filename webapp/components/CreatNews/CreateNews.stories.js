import CreateNews from './CreateNews.vue'

export default {
  title: 'CreateNews',
  component: CreateNews,
  argTypes: { add: { action: 'add' }, background: { control: 'color' } },
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CreateNews },
  template: '<CreateNews  @add-news="add" v-bind="$props"/>',
})

export const NewsForm = Template.bind({})
NewsForm.args = {}
