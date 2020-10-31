import { describe, expect, it } from "@jest/globals";
import { mount } from "@vue/test-utils";
import News from "./News.vue";
require("regenerator-runtime/runtime");

describe("myComponent", () => {
  it("Test coverage for delete emit", async () => {
    let wrapper = mount(News);
    wrapper.vm.deleteItem();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()["delete-news"].length).toBe(1);
  });

  it("Test coverage for update emit", async () => {
    const newsObject = { id: 0, title: "Just", votes: 0 };
    const expectedObject = { id: 0, title: "Just", votes: 5 };
    let wrapper = mount(News, {
      propsData: {
        news: newsObject,
      },
    });
    wrapper.vm.updateItem(5);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update")).toEqual([[expectedObject]]);
  });
});
