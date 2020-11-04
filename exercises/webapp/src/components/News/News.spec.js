import { describe, expect, it } from "@jest/globals";
import { mount } from "@vue/test-utils";
import News from "./News.vue";
require("regenerator-runtime/runtime");

describe("News", () => {
  it("should correctly emit when the delete button is clicked", async () => {
    let wrapper = mount(News);
    const deleteButton = wrapper.find(".delete");
    await deleteButton.trigger("click");
    expect(wrapper.emitted("delete-news")).toBeTruthy();
  });

  it("should correctly increment votes when the upvote button is clicked", async () => {
    const newsObject = { id: 0, title: "Just", votes: 3 };
    let wrapper = mount(News, {
      propsData: {
        news: newsObject,
      },
    });
    await wrapper.find("button.upvote").trigger("click");
    setTimeout(() => {
      expect(wrapper.emitted("update")).toBeTruthy();
      const newsHeader = wrapper.find("h2");
      expect(newsHeader.text()).toContain(4);
    }, 2000);
  });

  it("should correctly decrease votes when the downvote button is clicked", async () => {
    const newsObject = { id: 0, title: "Just", votes: 3 };
    let wrapper = mount(News, {
      propsData: {
        news: newsObject,
      },
    });
    await wrapper.find("button.downvote").trigger("click");
    setTimeout(() => {
      expect(wrapper.emitted("update")).toBeTruthy();
      const newsHeader = wrapper.find("h2");
      expect(newsHeader.text()).toContain(2);
    }, 2000);
  });
});
