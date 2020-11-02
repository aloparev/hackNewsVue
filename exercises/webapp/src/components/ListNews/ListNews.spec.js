import { describe, expect, it } from "@jest/globals";
import { mount } from "@vue/test-utils";
import ListNews from "./ListNews.vue";
require("regenerator-runtime/runtime");

describe("ListNews", () => {
  it('Test will return "The list is empty :(" if newsList contains no items', () => {
    const wrapper = mount(ListNews, {
      data() {
        return {
          newsList: [],
        };
      },
    });
    const paragraph = wrapper.find("h1");

    expect(paragraph.text()).toEqual("The list is empty :(");
  });

  it("Test will check for present default news in list", () => {
    const wrapper = mount(ListNews);
    const defaultList = [
      { id: 0, title: "Just", votes: 0 },
      { id: 1, title: "VueJS", votes: 0 },
      { id: 2, title: "Rocks", votes: 0 },
    ];
    expect(wrapper.vm.sortedNews).toEqual(defaultList);
  });

  it("Test will check for wether news are sorted descending by their votes", () => {
    const wrapper = mount(ListNews, {
      data() {
        return {
          newsList: [
            { id: 0, title: "Just", votes: 0 },
            { id: 1, title: "VueJS", votes: 0 },
            { id: 2, title: "Rocks", votes: 0 },
          ],
          descending: true,
        };
      },
    });
    wrapper.vm.update({ id: 1, title: "VueJS", votes: 2 });
    expect(wrapper.vm.sortedNews[0].votes).toBe(2);

    wrapper.vm.update({ id: 2, title: "Rocks", votes: 5 });
    expect(wrapper.vm.sortedNews[0].votes).toBe(5);

    wrapper.vm.update({ id: 2, title: "Rocks", votes: -5 });
    expect(wrapper.vm.sortedNews[0].votes).toBe(2);
  });

  it("Test will check functionality of sorting button", () => {
    const wrapper = mount(ListNews, {
      data() {
        return {
          newsList: [
            { id: 0, title: "Just", votes: 3 },
            { id: 1, title: "VueJS", votes: 1 },
            { id: 2, title: "Rocks", votes: 2 },
          ],
          descending: true,
        };
      },
    });

    //sorting to ascending
    const sortButton = wrapper.find("button");
    sortButton.trigger("click");
    expect(wrapper.vm.asc).toEqual(-1);
    expect(wrapper.vm.sortedNews[0].votes).toBe(1);

    //sorting to descending
    sortButton.trigger("click");
    expect(wrapper.vm.asc).toEqual(1);
    expect(wrapper.vm.sortedNews[0].votes).toBe(3);
  });
});
