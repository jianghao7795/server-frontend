<template>
  <div class="view-content">
    <n-space>
      <n-button
        strong
        secondary
        round
        v-for="(item, index) in tagList"
        :key="item.ID"
        :type="colorIndex(index)"
        @click="searchArticle(item.name)"
      >
        {{ item.name }}
      </n-button>
    </n-space>
  </div>
</template>

<script lang="ts" setup name="Tag">
import { NSpace, NButton } from "naive-ui";
import { getTagList } from "@/services/tag";
import { onMounted, ref } from "vue";
import { colorIndex } from "@/common/article";
import { useRouter } from "vue-router";

const router = useRouter();
const tagList = ref<API.Tag[]>([]);
onMounted(async () => {
  const resp = await getTagList();
  tagList.value = resp?.data?.list;
});

const searchArticle = (name: string) => {
  router.push(`/tags/search/${name}`);
};
</script>
