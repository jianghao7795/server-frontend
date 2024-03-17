<template>
  <p>{{ props.imgUrl }}</p>
</template>

<script lang="ts">
export default {
  name: "Content",
};
</script>

<script lang="ts" setup>
import { onMounted } from "vue";

const props = defineProps<{ imgUrl: string }>();

onMounted(() => {
  // console.log("234234234234");
});
</script>
