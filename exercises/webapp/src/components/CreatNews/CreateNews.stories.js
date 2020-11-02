import CreateNews from "./CreateNews.vue";

export default {
  title: "CreateNews",
  component: CreateNews,
  argTypes: {
    backgroundColor: { control: "color" },
    onClick: { action: "clicked" },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CreateNews },
  template: "<CreateNews :title='title' @addNews='add-news' />",
});

export const Red = Template.bind({});
Red.args = {
  title: "ihooih",
  backgroundColor: "#e00",
};
