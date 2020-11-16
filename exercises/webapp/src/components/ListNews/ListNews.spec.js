import { describe, expect, it } from "@jest/globals";
import { mount } from "@vue/test-utils";
import ListNews from "./ListNews.vue";
import News from "../News/News.vue";
require("regenerator-runtime/runtime");

describe("ListNews", () => {

  describe('given empty list', () => {
    let items
    beforeEach(() => {
      items = []
    })
    it('should display "The list is empty :(" if newsList contains no items', () => {
      const wrapper = mount(ListNews, {
        data() {
           return {
             newsList : items
           }
        }
      });

      const paragraph = wrapper.find("#error-message");

      expect(paragraph.text()).toEqual("The list is empty :(");
    })
  });

  it("should display default news in list", () => {
    const wrapper = mount(ListNews);
    const title = ["Just", "VueJS", "Rocks"];

    const news = wrapper.findAllComponents(News);
    expect(news.at(0).text()).toContain(title[0]);
    expect(news.at(1).text()).toContain(title[1]);
    expect(news.at(2).text()).toContain(title[2]);
  });

  it("should toggle between ascending and descending order", async () => {
    const wrapper = mount(ListNews, {
      data() {
        return {
          newsList: [
            { id: 0, title: "Just", votes: 3 },
            { id: 1, title: "VueJS", votes: 1 },
            { id: 2, title: "Rocks", votes: 2 },
          ],
          desc: true,
        };
      },
    });

    //sorting to ascending
    const sortButton = wrapper.find("button");
    await sortButton.trigger("click");
    let news = wrapper.findAllComponents(News);
    expect(news.at(0).text()).toContain(1);

    //sorting to descending
    await sortButton.trigger("click");
    news = wrapper.findAllComponents(News);
    expect(news.at(0).text()).toContain(3);
  });
});
