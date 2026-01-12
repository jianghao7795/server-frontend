<template>
  <div>
    <n-layout position="absolute" v-bind:on-scroll="changeScroll">
      <n-layout-header position="static" v-once>
        <n-card :bordered="false" class="darkStyle" :header-style="headerStyle">
          <template #header-extra>
            <div class="headerStyleLine" ref="searchRef" :class="{ visible: visible, visibleNo: !visible }">
              <NSpace :inline="true" :size="0">
                <div class="toopli">
                  <n-icon :class="{ disSearch: isSearch }" :component="Search" @click="searchFouns" />
                </div>
                <div class="toopli">
                  <NInput
                    ref="searchInputRef"
                    v-model:value="searchInput"
                    class="search"
                    :class="{ searchLine: isSearch }"
                    placeholder="搜索文章"
                    type="text"
                    @keyup.enter="submit"
                    :on-blur="sarchBlur"
                  >
                    <template #prefix><n-icon :class="{ disSearch: !isSearch }" :component="Search" /></template>
                  </NInput>

                  <!-- <n-list v-show="isSearch">
                    <n-list-item>
                      <n-thing v-if="searchHistoryAfter.length !== 0">
                        <div class="sarch-history-detail" v-for="item in searchHistoryAfter" key="item" @click="selectMark">{{ item }}</div>
                      </n-thing>
                      <div v-else>暂无搜索历史</div>
                    </n-list-item>
                  </n-list> -->
                </div>
                <div class="toopli">
                  <n-tabs
                    type="bar"
                    animated
                    :value="viewPage"
                    size="small"
                    :bar-width="28"
                    justify-content="space-evenly"
                    :tab-style="{ margin: '0 5px', fontWeight: 'bold' }"
                    :on-update:value="(e: string) => changePath(e)"
                  >
                    <n-tab name="/" tab="首页"></n-tab>
                    <n-tab name="/articles" tab="文章"></n-tab>
                    <n-tab name="/tags" tab="标签"></n-tab>
                    <n-tab name="/about" tab="关于"></n-tab>
                  </n-tabs>
                </div>
              </NSpace>
            </div>
          </template>
          <template #header>
            <div class="headerStyleLine" :class="{ visible: visible, visibleNo: !visible }">
              <b v-if="isLogin" style="cursor: pointer">
                <n-dropdown
                  :options="options"
                  placement="bottom-end"
                  trigger="hover"
                  :show-arrow="true"
                  @select="userLogout"
                >
                  <n-avatar round size="small" :src="headImage">
                    <template #fallback>
                      <img src="/tx.jpg" alt="avatar" />
                    </template>
                  </n-avatar>
                </n-dropdown>
              </b>
              <span v-else>
                <b @click="() => changeLogin(true)" style="cursor: pointer">登录</b>
                <NDivider vertical />
                <b @click="() => changeRegisterStatus(true)" style="cursor: pointer">注册</b>
              </span>
            </div>
          </template>
          <div class="blankText"></div>
        </n-card>
      </n-layout-header>
      <!-- include exclude 包含和不包含 字符串是组件的name -->
      <n-layout-content position="static" class="middle-view">
        <NSpin :show="loadingFlag">
          <RouterView v-slot="{ Component, route }">
            <transition mode="out-in" name="fade-in-linear" type="transition" :appear="true">
              <!-- <keep-alive v-bind:exclude="['ArticleDetail', 'Article']"> -->
              <component :is="Component" :key="route.name" />
              <!-- </keep-alive> -->
            </transition>
          </RouterView>
        </NSpin>
      </n-layout-content>
      <n-back-top :right="50" />
      <n-layout-footer position="static" v-once>
        <!-- style="width: 100%; height: 100px; position: absolute; bottom: 0px; left: 0px" -->
        <footer class="footerStyle">
          <span>Copyright © {{ dayjs().format("YYYY") }}</span>
        </footer>
      </n-layout-footer>
    </n-layout>
    <n-drawer v-model:show="active" placement="bottom" :height="400">
      <n-drawer-content title="更换背景图片">
        <n-carousel :space-between="30" :loop="false" slides-per-view="auto" draggable>
          <n-carousel-item style="width: 30%" v-for="item in bgImage" :key="item.ID">
            <n-popconfirm positive-text="确认" negative-text="取消" :on-positive-click="() => changeImages(item)">
              <template #trigger>
                <img
                  :src="item.url.includes('http') ? item.url : `${Base_URL}/${item.url}`"
                  :title="item.name"
                  class="carousel-img"
                  @error="handleImageError"
                />
              </template>
              确定更换背景图片？
            </n-popconfirm>
          </n-carousel-item>
        </n-carousel>
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="loginStatus" :width="502" placement="left">
      <n-drawer-content title="登录">
        <n-form
          ref="formRef"
          :model="userInfo"
          :rules="rules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          size="large"
          @keyup.enter.native="login"
        >
          <n-form-item path="name">
            <n-input type="text" v-model:value="userInfo.name" placeholder="账号" />
          </n-form-item>
          <n-form-item path="password">
            <n-input type="password" show-password-on="click" v-model:value="userInfo.password" placeholder="密码" />
          </n-form-item>
          <div>
            <n-button :loading="userStore.loading" type="primary" :block="true" @click="() => login()">登录</n-button>
          </div>
        </n-form>
      </n-drawer-content>
    </n-drawer>
    <register :register-status="registerStatus" @change-status="changeRegisterStatus" />
    <ResetPassord :active="revisePassword" @change-status="changeResetPasswordStatus" @resetStore="resetStore" />
    <Person :active="personalInformationStatus" @changeStatus="changePersonalInformationStatus" />
  </div>
</template>

<script setup lang="ts" name="Layout">
import { onMounted, ref, watch, provide, computed, h } from "vue";
// import type { CSSProperties } from "vue";
// import type { FormInst } from "naive-ui";
import {
  NIcon,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NButton,
  NCarousel,
  NPopconfirm,
  NCarouselItem,
  NLayout,
  NInput,
  NTab,
  NSpace,
  NAvatar,
  NTabs,
  NSpin,
  NDropdown,
  NCard,
  NLayoutHeader,
  NDivider,
  NLayoutContent,
  NBackTop,
  NLayoutFooter,
  NImage,
} from "naive-ui";
import { RouterView, useRouter, useRoute } from "vue-router";
import { Search, Logout, Change, SettingTwo, Lock, Avatar } from "@icon-park/vue-next";
import dayjs from "dayjs";
import { emitter } from "@/utils/common";
import { getImages } from "@/services/image";
import { useUserStore } from "@/stores/user";
import { updateBackgroundImage } from "@/services/user";
import Register from "./components/register.vue";
import Person from "./components/person.vue";
import ResetPassord from "./components/reset_password.vue";
// import md5 from "md5";
import { getToSession, saveToSession } from "@/utils/util";
let scrollSize = 0;

const headerStyle = `
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  padding-top: 10px;
`;

const visible = ref<boolean>(false);

const changeScroll = (e: Event) => {
  if (route.meta.title !== "文章详情") {
    return;
  }
  if ((e.target as HTMLElement).scrollTop - scrollSize > 150) {
    // console.log((e.target as HTMLElement).scrollTop - scrollSize < 150);
    scrollSize = (e.target as HTMLElement).scrollTop;
    // console.log("向下滚动", scrollSize, (e.target as HTMLElement).scrollTop);
    visible.value = true;
    return;
  }
  if ((e.target as HTMLElement).scrollTop - scrollSize < -100) {
    scrollSize = (e.target as HTMLElement).scrollTop;
    // console.log("向上滚动", scrollSize);
    visible.value = false;
    return;
  }
};

const userStore = useUserStore();
const Base_URL = import.meta.env.VITE_BASE_API as string;
const headImage = computed(() => `${Base_URL}/${userStore.currentUser?.user?.headerImg}`);
// 默认背景图路径
const defaultBgImage = `/home-bg.png`;
// 实际使用的背景图 URL，初始值为默认背景图
const actualBgImage = ref<string>(new URL(defaultBgImage, import.meta.url).href);

const handleImageError = (e: Event) => {
  console.log(e);
  actualBgImage.value = new URL(defaultBgImage, import.meta.url).href;
};

// 计算背景图 URL
const computedBgImageUrl = computed(() => {
  if (userStore.currentUser?.user?.head_img) {
    const imageUrl = userStore.currentUser.user.head_img.includes("http")
      ? userStore.currentUser.user.head_img
      : `${Base_URL}/${userStore.currentUser.user.head_img}`;
    return new URL(imageUrl, import.meta.url).href;
  }
  return new URL(defaultBgImage, import.meta.url).href;
});

// 检测图片是否可以加载
const checkImageLoad = () => {
  const img = new Image();
  const imageUrl = computedBgImageUrl.value;

  img.onload = () => {
    // 图片加载成功
    actualBgImage.value = imageUrl;
  };

  img.onerror = () => {
    // 图片加载失败（404等），使用默认值
    actualBgImage.value = new URL(defaultBgImage, import.meta.url).href;
  };

  img.src = imageUrl;
};

// 监听用户信息变化，重新检测图片
watch(
  () => userStore.currentUser?.user?.head_img,
  () => {
    checkImageLoad();
  },
  { immediate: true },
);

const colorSet = computed(() => `url(${actualBgImage.value})`);

const route = useRoute();
const router = useRouter();
const searchInputRef = ref<HTMLInputElement>();
const searchInput = ref<string>("");
const loadingFlag = ref<boolean>(false);
const isSearch = ref<boolean>(false);
// const isSearchFouns = ref<boolean>(false);
// const isMouseOver = ref<boolean>(false);
const viewPage = ref<string>(route.fullPath);
// const colorSet = ref<string>(`url(${new URL("/home-bg.png", import.meta.url).href})`);
const bgImage = ref<User.Images[]>([]);
const active = ref<boolean>(false);
const currentRouter = ref<string>("");
// 注册页面的status
const registerStatus = ref<boolean>(false);
//登录页面的status
const loginStatus = ref<boolean>(false);

const personalInformationStatus = ref<boolean>(false);
// 主题状态
// const theme = inject<Ref<GlobalTheme | null>>("theme");
// const darkTheme = computed(() => !(theme?.value === null));
//form Ref
// const formRef = ref<FormInst | null>(null);
// 修改密码status
const revisePassword = ref<boolean>(false);
// const isSearch = ref<boolean>(false);
const searchFouns = () => {
  searchInputRef.value?.focus();
  isSearch.value = !isSearch.value;
};
const sarchBlur = () => {
  console.log("失去焦点");
  searchInputRef.value?.blur();
  isSearch.value = !isSearch.value;
};
// 是否登录
const isLogin = computed(() => !!userStore.currentUser?.user?.ID);
const userInfo = ref<{ name: string; password: string }>({
  name: "admin_user",
  password: "123456",
});

const rules = {
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入账号",
  },
  password: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入密码",
  },
};

const options = [
  {
    label: "个人信息",
    key: "setting",
    icon: () => {
      return h(NIcon, null, {
        default: () =>
          h(SettingTwo, {
            theme: "outline",
            size: 26,
            strokeWidth: 3,
          }),
      });
    },
  },
  //<setting-two theme="outline" size="26" fill="#333" :strokeWidth="3"/>
  {
    label: "修改密码",
    key: "lock",
    icon: () => {
      return h(NIcon, null, {
        default: () => {
          return h(Lock, {
            theme: "outline",
            size: 26,
            strokeWidth: 3,
          });
        },
      });
    },
  },
  // <lock theme="outline" size="26" fill="#333" :strokeWidth="3"/>
  {
    label: "更改背景图",
    key: "change",
    icon: () => {
      return h(NIcon, null, {
        default: () =>
          h(Change, {
            theme: "outline",
            size: "26",
            strokeWidth: 3,
          }),
      });
    },
  },
  {
    label: "退出登录",
    key: "logout",
    icon: () => {
      return h(NIcon, null, {
        default: () =>
          h(Logout, {
            theme: "outline",
            size: "26",
            strokeWidth: 3,
          }),
      });
    },
  },
];

// const selectMark = (e: MouseEvent) => {
//   const htmlElement = e.target as HTMLDivElement;
//   const search = htmlElement.innerText;

//   router.push(`/articles/search/${search}`);
//   if (!searchHistoryAfter.value.includes(search)) {
//     const searchTotal = [search, ...searchHistoryAfter.value];
//     searchHistoryAfter.value = searchTotal;
//     saveToSession("history", searchTotal.slice(0, 5));
//   } else {
//     const sessionTotal = getToSession("history");
//     saveToSession("history", sessionTotal);
//   }

//   searchInput.value = search;
//   isSearch.value = false;
// };

// const updateIsSeach = (status: boolean) => {
//   isSearch.value = status;
// };

// const clearSoom = () => {
//   setTimeout(() => {
//     if (!isSearch.value) {
//       isSearch.value = false;
//     }
//   }, 500);
// };

const resetStore = () => {
  userStore.$reset();
  localStorage.removeItem("token");
  // colorSet.value = `url(${new URL("/home-bg.png", import.meta.url).href})`;
  loginStatus.value = true;
  userInfo.value = {
    name: "admin_user",
    password: "123456",
  };
};

const changePersonalInformationStatus = (status: boolean) => {
  personalInformationStatus.value = status;
};

const userLogout = (key: string | number) => {
  if (key === "logout") {
    resetStore();
  }
  // debugger;
  if (key === "change") {
    changeActive(true);
  }

  if (key === "lock") {
    changeResetPasswordStatus(true);
  }

  if (key === "setting") {
    changePersonalInformationStatus(true);
  }
};

const changeRegisterStatus = (status: boolean): void => {
  registerStatus.value = status;
};

const changeResetPasswordStatus = (status: boolean): void => {
  revisePassword.value = status;
};

const searchHistoryAfter = ref<string[]>((getToSession("history") || []).slice(0, 5));

const changeImages = async (data: User.Images) => {
  await updateBackgroundImage({
    ID: userStore.currentUser.user.ID,
    head_img: data.url,
  });
  window.$message.success("更换成功");
  active.value = false;
  if (userStore.currentUser?.user) {
    userStore.updateUserInfo({ ...userStore.currentUser.user, head_img: data.url });
  }
  // colorSet.value = `url(${new URL(data.url.includes("http") ? data.url : `${Base_URL}/${data.url}`, import.meta.url).href})`;
};

const changeActive = (status: boolean) => {
  active.value = status;
};

const changeLogin = (status: boolean): void => {
  loginStatus.value = status;
};
provide("changeLogin", changeLogin); // 传递方法给下级

const login = () => {
  userStore.logins({ username: userInfo.value.name, password: userInfo.value.password }, () => {
    getImages().then((resp) => {
      if (resp) {
        bgImage.value = resp.data;
      }
    });
    loginStatus.value = false;
    userInfo.value = {
      name: "",
      password: "",
    };
  });
};

// const railStyle = ({ checked }: { checked: boolean }) => {
//   const style: CSSProperties = { lineHeight: "1rem" };
//   if (checked) {
//     style.background = "#222";
//   } else {
//     style.background = "#eee";
//   }
//   return style;
// };

// const changeTheme = (e: boolean) => {
//   if (e) {
//     emitter.emit("darkMode");
//   } else {
//     emitter.emit("lightMode");
//   }
// };

watch(
  () => route.fullPath,
  (value) => {
    const pathArray = value.split("/");
    viewPage.value = `/${pathArray[1]}`;
    switch (pathArray[1]) {
      case undefined:
        currentRouter.value = "首页";
        break;
      case "articles":
        currentRouter.value = "文章";
        break;
      case "about":
        currentRouter.value = "关于我";
        break;
      case "tags":
        currentRouter.value = "标签";
        break;
      default:
        currentRouter.value = "首页";
    }
  },
);

onMounted(async () => {
  emitter.on("showLoading", () => {
    loadingFlag.value = true;
  });
  const pathArray = route.fullPath.split("/");
  viewPage.value = `/${pathArray[1]}`;
  switch (pathArray[1]) {
    case undefined:
      currentRouter.value = "首页";
      break;
    case "articles":
      currentRouter.value = "文章";
      break;
    case "about":
      currentRouter.value = "关于我";
      break;
    case "tags":
      currentRouter.value = "标签";
      break;
    default:
      currentRouter.value = "首页";
  }
  const token = localStorage.getItem("token");
  emitter.on("closeLoading", () => {
    loadingFlag.value = false;
  });
  if (token) {
    await userStore.getUser(async () => {
      const resp = await getImages();
      if (resp?.code === 200) {
        bgImage.value = resp.data;
      }
    });
  }
});

// console.log(colorSet.value);
const changePath = (url: string) => {
  router.push(url);
};

const submit = () => {
  if (searchInput.value === "") {
    window.$message.warning("请输入");
    searchInputRef?.value?.focus();
    return;
  }
  const searchValue = searchInput.value;
  router.push(`/articles/search/${searchValue}`);
  if (!searchHistoryAfter.value.includes(searchValue)) {
    const searchTotal = [searchValue, ...searchHistoryAfter.value];
    searchHistoryAfter.value = searchTotal.slice(0, 5);
    saveToSession("history", searchTotal.slice(0, 5));
  }
  searchInputRef.value?.blur();
  // saveToSession();
};
</script>

<style scoped lang="css">
.carousel-img {
  width: 100%;
  /* // height: 240px; */
  object-fit: cover;
}

.headerStyleLine {
  font-size: 15px;
  line-height: 35px;
  max-height: 41px;
}

.headerStyleLine > b > span {
  margin-top: 8px;
}

.darkStyle {
  background-color: #000;
  background-image: v-bind(colorSet);
  background-position: center;
  height: auto;
  width: 100%;
  background-size: cover;
  background-attachment: scroll;
  z-index: 1;
  margin-bottom: 20px;
}

.darkStyle > div {
  background-image: linear-gradient(rgba(75, 75, 75, 1), rgba(255, 255, 255, 0));
}

.footerStyle {
  text-align: center;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.toopli {
  /* display: inline-block; */
  margin: 0;
  padding: 0;
}

.toopli > ul {
  display: flex;
  height: 0;
  margin: 0;
}

/* .toopli > ul > li { */
/*   /* cursor: default; */

/* .sarch-history-detail { */
/*   width: 100%; */
/* } */

/* .sarch-history-detail:hover { */
/*   background-color: #999; */
/* } */

.middle-view {
  min-height: calc(100% - 430px);
}

.visible {
  transition: transform 1s;
  transform: translate3d(0, -200%, 0);
}

.visibleNo {
  transition: transform 1s;
  transform: translate3d(0);
}

.blankText {
  min-height: 400px;
  max-height: 600px;
}

.search {
  width: 0px;
  margin-top: 0px;
  transition-property: width;
  transition-duration: 0.5s;
  transition-timing-function: linear;
  transition-delay: 0s;
}

.searchLine {
  width: 200px;
  display: block;
}

.disSearch {
  display: none;
}
</style>
