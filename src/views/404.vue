<template>
  <n-result status="warning" title="404" description="哎呀，没找到">
    <template #footer>
      <n-button @click="changeRouter">看看别的</n-button>
    </template>
  </n-result>
</template>

<script lang="ts" setup name="404">
import { useRouter } from "vue-router";

const router = useRouter();
const changeRouter = () => {
  router.push("/articles");
};
</script>
