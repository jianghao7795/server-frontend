{
  /* <template>
  <n-result status="warning" title="404" description="哎呀，没找到">
    <template #footer>
      <n-button @click="changeRouter">看看别的</n-button>
    </template>
  </n-result>
</template>

<script lang="ts" setup name="404">
import { NResult, NButton } from "naive-ui";
import { useRouter } from "vue-router";

const router = useRouter();
const changeRouter = () => {
  router.push("/articles");
};
</script> */
}

import { NResult, NButton } from "naive-ui";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NotFound",
  components: {
    NResult,
    NButton,
  },
  setup() {
    const router = useRouter();
    const changeRouter = () => {
      router.push("/articles");
    };
    return () => {
      return (
        <NResult status="warning" title="404" description="哎呀，没找到">
          {{
            footer: () => <NButton onClick={changeRouter}>看看别的</NButton>,
          }}
        </NResult>
      );
    };
  },
});
