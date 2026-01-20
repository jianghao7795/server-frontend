import { createRouter, createWebHashHistory } from "vue-router";

// console.log(import.meta.env.VITE_BASE_PATH);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/layout/index"),
      children: [
        {
          path: "/",
          name: "index",
          component: () => import("@/views/home/index"),
          meta: {
            title: "首页",
          },
        },
        {
          path: "/about",
          name: "about",
          component: () => import("@/views/about/index"),
          meta: {
            title: "关于",
          },
        },
        {
          path: "/tags",
          name: "tag",
          component: () => import("@/views/tag"),
          meta: {
            title: "标签",
          },
        },
        {
          path: "/articles",
          name: "article",
          component: () => import("@/views/article/index"),
          meta: {
            title: "文章",
          },
        },
        {
          path: "/articles/:id",
          name: "id",
          component: () => import("@/views/article/detail"),
          meta: {
            title: "文章详情",
          },
        },
        {
          path: "/:name/search/:value",
          name: "search",
          component: () => import("@/views/search"),
          meta: {
            title: "搜索结果",
          },
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: () => import("@/views/404"),
          meta: {
            title: "404",
          },
        },
      ],
    },
    // {
    //   path: "/:pathMatch(.*)*",
    //   name: "NotFound",
    //   component: () => import("@/views/404.vue"),
    //   meta: {
    //     title: "404",
    //   },
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
});

router.beforeEach((to, _, next) => {
  window.document.title = to.meta.title as string;
  window.$loadingBar.start();
  next();
});

router.afterEach(() => {
  window.$loadingBar.finish();
});

router.onError(() => {
  window.$loadingBar.error();
});

export default router;
