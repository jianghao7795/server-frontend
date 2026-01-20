import { defineComponent, onMounted, ref, watch, provide, computed, h, Transition } from "vue";
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
} from "naive-ui";
import { RouterView, useRouter, useRoute } from "vue-router";
import { Search, Logout, Change, SettingTwo, Lock } from "@icon-park/vue-next";
import dayjs from "dayjs";
import { emitter } from "@/utils/common";
import { getImages } from "@/services/image";
import { useUserStore } from "@/stores/user";
import { updateBackgroundImage } from "@/services/user";
import Register from "./components/register";
import Person from "./components/person";
import ResetPassord from "./components/reset_password";
import { getToSession, saveToSession } from "@/utils/util";
import styles from "./index.module.css";

let scrollSize = 0;

const headerStyle = `
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  padding-top: 10px;
`;

export default defineComponent({
  name: "Layout",
  setup() {
    const visible = ref<boolean>(false);
    const userStore = useUserStore();
    const Base_URL = import.meta.env.VITE_BASE_API as string;
    const headImage = computed(() => `${Base_URL}/${userStore.currentUser?.user?.headerImg}`);
    const defaultBgImage = `/home-bg.png`;
    const actualBgImage = ref<string>(new URL(defaultBgImage, import.meta.url).href);

    const handleImageError = (e: Event) => {
      console.log(e);
      actualBgImage.value = new URL(defaultBgImage, import.meta.url).href;
    };

    const computedBgImageUrl = computed(() => {
      if (userStore.currentUser?.user?.head_img) {
        const imageUrl = userStore.currentUser.user.head_img.includes("http")
          ? userStore.currentUser.user.head_img
          : `${Base_URL}/${userStore.currentUser.user.head_img}`;
        return new URL(imageUrl, import.meta.url).href;
      }
      return new URL(defaultBgImage, import.meta.url).href;
    });

    const checkImageLoad = () => {
      const img = new Image();
      const imageUrl = computedBgImageUrl.value;

      img.onload = () => {
        actualBgImage.value = imageUrl;
      };

      img.onerror = () => {
        actualBgImage.value = new URL(defaultBgImage, import.meta.url).href;
      };

      img.src = imageUrl;
    };

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
    const viewPage = ref<string>(route.fullPath);
    const bgImage = ref<User.Images[]>([]);
    const active = ref<boolean>(false);
    const currentRouter = ref<string>("");
    const registerStatus = ref<boolean>(false);
    const loginStatus = ref<boolean>(false);
    const personalInformationStatus = ref<boolean>(false);
    const revisePassword = ref<boolean>(false);
    const searchRef = ref<HTMLElement | null>(null);

    const changeScroll = (e: Event) => {
      if (route.meta.title !== "文章详情") {
        return;
      }
      if ((e.target as HTMLElement).scrollTop - scrollSize > 150) {
        scrollSize = (e.target as HTMLElement).scrollTop;
        visible.value = true;
        return;
      }
      if ((e.target as HTMLElement).scrollTop - scrollSize < -100) {
        scrollSize = (e.target as HTMLElement).scrollTop;
        visible.value = false;
        return;
      }
    };

    const searchFouns = () => {
      searchInputRef.value?.focus();
      isSearch.value = !isSearch.value;
    };

    const sarchBlur = () => {
      console.log("失去焦点");
      searchInputRef.value?.blur();
      isSearch.value = !isSearch.value;
    };

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

    const resetStore = () => {
      userStore.$reset();
      localStorage.removeItem("token");
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
    };

    const changeActive = (status: boolean) => {
      active.value = status;
    };

    const changeLogin = (status: boolean): void => {
      loginStatus.value = status;
    };
    provide("changeLogin", changeLogin);

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
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        login();
      }
    };

    return () => {
      return (
        <div>
          <NLayout position="absolute" onScroll={changeScroll}>
            <NLayoutHeader position="static">
              <NCard
                bordered={false}
                class={styles.darkStyle}
                headerStyle={headerStyle}
                style={{ backgroundImage: colorSet.value }}
              >
                {{
                  "header-extra": () => (
                    <div class={[styles.headerStyleLine, visible.value ? styles.visible : styles.visibleNo]} ref={searchRef}>
                      <NSpace inline={true} size={0}>
                        
                        <div class={styles.toopli}>
                          <NInput
                            ref={searchInputRef}
                            value={searchInput.value}
                      
                            onUpdate:value={(val: string) => (searchInput.value = val)}
                           
                            placeholder="搜索文章"
                            type="text"
                            onKeyup={(e: KeyboardEvent) => {
                              if (e.key === "Enter") {
                                submit();
                              }
                            }}
                            onBlur={sarchBlur}
                          >
                            {{
                              prefix: () => <NIcon component={Search} />,
                            }}
                          </NInput>
                        </div>
                        <div class="toopli">
                          <NTabs
                            type="bar"
                            animated
                            value={viewPage.value}
                            size="small"
                            barWidth={28}
                            justifyContent="space-evenly"
                            tabStyle={{ margin: "0 5px", fontWeight: "bold" }}
                            onUpdate:value={(e: string) => changePath(e)}
                          >
                            <NTab name="/" tab="首页" />
                            <NTab name="/articles" tab="文章" />
                            <NTab name="/tags" tab="标签" />
                            <NTab name="/about" tab="关于" />
                          </NTabs>
                        </div>
                      </NSpace>
                    </div>
                  ),
                  header: () => (
                    <div class={[styles.headerStyleLine, visible.value ? styles.visible : styles.visibleNo]}>
                      {isLogin.value ? (
                        <b style="cursor: pointer">
                          <NDropdown
                            options={options}
                            placement="bottom-end"
                            trigger="hover"
                            showArrow={true}
                            onSelect={userLogout}
                          >
                            <NAvatar round size="small" src={headImage.value}>
                              {{
                                fallback: () => <img src="/tx.jpg" alt="avatar" />,
                              }}
                            </NAvatar>
                          </NDropdown>
                        </b>
                      ) : (
                        <span>
                          <b onClick={() => changeLogin(true)} style="cursor: pointer">
                            登录
                          </b>
                          <NDivider vertical />
                          <b onClick={() => changeRegisterStatus(true)} style="cursor: pointer">
                            注册
                          </b>
                        </span>
                      )}
                    </div>
                  ),
                  default: () => <div class={styles.blankText}></div>,
                }}
              </NCard>
            </NLayoutHeader>
            <NLayoutContent position="static" class={styles.middleView}>
              <NSpin show={loadingFlag.value}>
                <RouterView>
                  {{
                    default: ({ Component, route }: { Component: any; route: any }) => (
                      <Transition mode="out-in" name="fade-in-linear" appear={true}>
                        <Component key={route.name} />
                      </Transition>
                    ),
                  }}
                </RouterView>
              </NSpin>
            </NLayoutContent>
            <NBackTop right={50} />
            <NLayoutFooter position="static">
              <footer class={styles.footerStyle}>
                <span>Copyright © {dayjs().format("YYYY")}</span>
              </footer>
            </NLayoutFooter>
          </NLayout>
          <NDrawer show={active.value} onUpdate:show={(val: boolean) => (active.value = val)} placement="bottom" height={400}>
            <NDrawerContent title="更换背景图片">
              <NCarousel spaceBetween={30} loop={false} slidesPerView="auto" draggable>
                {bgImage.value.map((item) => (
                  <NCarouselItem key={item.ID} style="width: 30%">
                    <NPopconfirm
                      positiveText="确认"
                      negativeText="取消"
                      onPositiveClick={() => changeImages(item)}
                    >
                      {{
                        trigger: () => (
                          <img
                            src={item.url.includes("http") ? item.url : `${Base_URL}/${item.url}`}
                            title={item.name}
                            class={styles.carouselImg}
                            onError={handleImageError}
                          />
                        ),
                        default: () => "确定更换背景图片？",
                      }}
                    </NPopconfirm>
                  </NCarouselItem>
                ))}
              </NCarousel>
            </NDrawerContent>
          </NDrawer>
          <NDrawer show={loginStatus.value} onUpdate:show={(val: boolean) => (loginStatus.value = val)} width={502} placement="left">
            <NDrawerContent title="登录">
              <NForm
                model={userInfo.value}
                rules={rules}
                labelPlacement="left"
                labelWidth="auto"
                requireMarkPlacement="right-hanging"
                size="large"
              >
                <NFormItem path="name">
                  <NInput
                    type="text"
                    value={userInfo.value.name}
                    onUpdate:value={(val: string) => (userInfo.value.name = val)}
                    placeholder="账号"
                  />
                </NFormItem>
                <NFormItem path="password">
                  <NInput
                    type="password"
                    showPasswordOn="click"
                    value={userInfo.value.password}
                    onUpdate:value={(val: string) => (userInfo.value.password = val)}
                    placeholder="密码"
                  />
                </NFormItem>
                <div>
                  <NButton loading={userStore.loading} type="primary" block={true} onClick={login}>
                    登录
                  </NButton>
                </div>
              </NForm>
            </NDrawerContent>
          </NDrawer>
          <Register registerStatus={registerStatus.value} onChangeStatus={changeRegisterStatus} />
          <ResetPassord active={revisePassword.value} onChangeStatus={changeResetPasswordStatus} onResetStore={resetStore} />
          <Person active={personalInformationStatus.value} onChangeStatus={changePersonalInformationStatus} />
        </div>
      );
    };
  },
});
