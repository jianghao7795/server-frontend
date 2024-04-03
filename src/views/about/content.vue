<template>
  <p>{{ props.imgUrl }}</p>
</template>

<script lang="ts" setup name="Content">
import { onMounted } from "vue";

const props = defineProps<{ imgUrl: string }>();

onMounted(() => {
  // console.log("234234234234");
});
</script>
