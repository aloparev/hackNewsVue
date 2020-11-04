import CreateNews from "./CreateNews.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "CreateNews",
  component: CreateNews,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CreateNews },
  template: '<CreateNews  @add-news="add" v-bind="$props"/>',
  methods: { add: action("clicked") },
});

export const NewsForm = Template.bind({});
NewsForm.args = {};
