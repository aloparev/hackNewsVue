import { action } from "@storybook/addon-actions";
import News from "./News.vue";

export default {
  title: "News",
  component: News
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { News},
  template: '<News @update="updateNews" @delete-news="deleteNews" v-bind="$props" />',
  methods: { updateNews: action('clicked'), deleteNews: action('clicked') }
});

export const NewsItem = Template.bind({});
NewsItem.args = {
    news:{
      id: 0,
      title: 'Example title',
      votes: 3
    }
};
