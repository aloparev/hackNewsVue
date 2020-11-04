import CreateNews from "./CreateNews.vue";
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';

export default {
  title: "CreateNews",
  component: CreateNews,
  argTypes: {
    backgroundColor: { control: "color" }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CreateNews },
  template: '<CreateNews  @add-news="add" v-bind="$props"/>',
  methods: { add: action('clicked') }
});


export const Red = Template.bind({});
Red.args = {
  backgroundColor: "#e00",
};
