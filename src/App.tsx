import { defineComponent, h, provide, ref } from "vue";
// import { RouterView } from "vue-router";
import type { GlobalTheme } from "naive-ui";
import {
  darkTheme,
  useLoadingBar,
  useMessage,
  useNotification,
  NConfigProvider,
  NLoadingBarProvider,
  NNotificationProvider,
  NMessageProvider,
} from "naive-ui";
import { emitter } from "@/utils/common";
import { useDark, useToggle } from "@vueuse/core";

export default defineComponent({
  setup() {
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    const theme = ref<GlobalTheme | null>(darkTheme);

    provide("theme", theme);
    emitter.on("darkMode", () => {
      theme.value = darkTheme;
      toggleDark();
    });

    emitter.on("lightMode", () => {
      theme.value = null;
      toggleDark();
    });

    function registerNaiveTools() {
      window.$loadingBar = useLoadingBar();
      window.$message = useMessage();
      window.$notification = useNotification();
    }

    const themeOverrides = {
      common: {
        textColorBase: "#73ffd0",
      },
    };

    const NaiveProviderContent = defineComponent({
      name: "NaiveProviderContent",
      setup() {
        registerNaiveTools();
      },
      render() {
        return h("div");
      },
    });

    return () => {
      return (
        <NConfigProvider theme={theme.value} ThemeOverrides={themeOverrides}>
          <NLoadingBarProvider>
            <div class="view-dark view-comment">
              <NNotificationProvider>
                <NMessageProvider>
                  <router-view />
                  <NaiveProviderContent />
                </NMessageProvider>
              </NNotificationProvider>
            </div>
          </NLoadingBarProvider>
        </NConfigProvider>
      );
    };
  },
});
