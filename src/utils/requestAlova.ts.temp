import { createAlova } from "alova";
import GlobalFetch from "alova/GlobalFetch";
import VueHook from "alova/vue";
import { useUserStore } from "@/stores/user";

const alovaInstance = createAlova({
  // 服务器根目录
  baseURL: "/api",
  timeout: 5000,

  // VueHook用于创建ref状态，包括请求状态loading、响应数据data、请求错误对象error等（后续详细介绍）
  statesHook: VueHook,

  // 请求适配器，我们推荐并提供了fetch请求适配器
  requestAdapter: GlobalFetch(),

  // localCache: { //缓存模式
  //   // 设置缓存模式为内存模式
  //   // mode: "memory",
  //   // 单位为毫秒
  //   // 当设置为`Infinity`，表示数据永不过期，设置为0或负数时表示不缓存
  //   expire: 60 * 10 * 1000,
  // },

  beforeRequest(method) {
    const userStore = useUserStore();
    method.config.headers.Authorization = `Bearer ${userStore.getToken}`;
  },
  responsed: {
    onSuccess: async (response) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      if (json.code !== 200) {
        // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
        throw new Error(json.message);
      }

      // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
      return json.data;
    },
    onError: (err, method) => {
      alert(err.message);
    },
  },
});

export default alovaInstance;
