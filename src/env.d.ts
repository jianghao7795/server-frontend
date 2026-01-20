/// <reference types="vite/client" />
/// <reference types="vue/jsx" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
