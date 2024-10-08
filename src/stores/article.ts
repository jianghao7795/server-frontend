import { getArticleList, getArticleDetail } from "@/services/article";
import { defineStore } from "pinia";

// export const mainStore = defineStore('main', {
//     /**
//      * 类似组件的 data, 用于存储全局的的状态
//      * 注意:
//      *    1.必须是函数, 为了在服务端渲染的时候避免交叉请求导致的数据交叉污染
//      *    2.必须是箭头函数, 为了更好的 TS 类型推导
//      */
//     state: () => {
//         return {
//             count: 100,
//           	foo: 'bar',
//           	age: 18
//         }
//     },
//     /**
//      * 类似组件的 computed, 用来封装计算属性, 具有缓存特性
//      */
//     getters: {

//     },
//     /**
//      * 类似组件的 methods, 封装业务逻辑, 修改state
//      * 注意: 里面的函数不能定义成箭头函数(函数体中会用到this)
//      */
//     actions: {

//     }
// })
export const useArticleStore = defineStore("article", {
  state: (): {
    page: number;
    list: API.Article[];
    detail: API.Article;
    total: number;
    showMore: boolean;
    loading: boolean;
  } => {
    return {
      page: 1,
      list: [],
      detail: <API.Article>{},
      total: 0,
      showMore: true,
      loading: false,
    };
  },
  getters: {},
  actions: {
    async getList(payload?: API.SearchArticle) {
      this.loading = true;
      const resp = await getArticleList({ ...payload, page: this.page });
      this.loading = false;
      this.list = [...this.list, ...resp.data?.list];
      this.total = resp.data.total;
      if (resp.data?.list?.length === 10) {
        this.showMore = true;
        this.page++;
      } else {
        this.showMore = false;
        this.page = 1;
      }
    },

    async getDetail(payload: { id: string }) {
      const resp = await getArticleDetail(payload.id);
      this.detail = resp.data;
    },
  },
});
