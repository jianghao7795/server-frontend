import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/static/less/content.less";
import App from "@/App.vue";
import router from "@/router";
import UndrawUi from "undraw-ui";
import "undraw-ui/dist/style.css";
import "./index.less";

const app = createApp(App);

app.use(createPinia());
app.use(UndrawUi);
app.use(router);

app.mount("#app");
