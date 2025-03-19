import { NButton } from "naive-ui";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const count = ref<number>(0);
    const increment = () => count.value++;

    return () => (
      <div>
        {/* <h1>Vue3 + vite + TSX</h1> */}
        <h2>{count.value}</h2>
        <NButton type="primary" onClick={increment}>
          点个赞吧
        </NButton>
      </div>
    );
  },
});
