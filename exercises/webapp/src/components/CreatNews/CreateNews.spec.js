import { describe, expect, it } from "@jest/globals";
import { mount } from "@vue/test-utils";
import CreateNews from "./CreateNews.vue";
require("regenerator-runtime/runtime");

describe("CreateNews", () => {
  it("Test for default empty title", () => {
    const wrapper = mount(CreateNews);
    expect(wrapper.vm.addNews()).toEqual();
  });

  it("Test for add news emit", async () => {
    const wrapper = mount(CreateNews, {
      data() {
        return {
          title: "TestTitle",
        };
      },
    });
    wrapper.vm.addNews();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()["add-news"].length).toBe(1);
  });
});
