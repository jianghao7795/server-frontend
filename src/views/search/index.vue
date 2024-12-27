<template>
  <div class="article-list">
    <n-page-header @back="handleBack">
      <div>
        <n-h4 class="sortH4">
          <a
            v-bind:style="{
              color: colorRef.time ? '#70a1ff' : undefined,
            }"
            @click="() => changeSort('time')"
          >
            时间排序
          </a>
          <n-divider vertical />
          <a
            v-bind:style="{
              color: colorRef.read ? '#70a1ff' : undefined,
            }"
            @click="() => changeSort('read')"
          >
            阅读排序
          </a>
        </n-h4>
        <n-list hoverable clickable v-if="data.length !== 0">
          <n-list-item v-for="item in data" :key="item.ID" @click="changeUrl(item.ID)">
            <n-thing content-style="margin-top: 10px;">
              <template #header>
                <div>
                  <h1>{{ item.title }}</h1>
                </div>
              </template>
              <template #description>
                <div>
                  简述:
                  <span>{{ item.desc }}</span>
                  <div>阅读量: {{ item.reading_quantity }}</div>
                  <div>发布于：{{ calculationTime(item.CreatedAt) }}</div>
                </div>
              </template>
              <!-- <md-editor v-model="item.content" preview-only /> -->
              <template #footer>
                <n-space size="small" style="margin-top: 4px">
                  <n-tag :bordered="false" size="small" v-for="i in item.tags" :type="colorIndex(i.ID)" :key="i.ID">
                    {{ i.name }}
                  </n-tag>
                </n-space>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-empty size="large" description="什么也没找到" v-else>
          <template #extra>
            <n-button size="small" type="primary" @click="changeLookOther">看看别的文章</n-button>
          </template>
        </n-empty>
        <div class="pageNext">
          <n-space justify="space-between">
            <n-button v-show="page !== 1" icon-placement="left">
              <template #icon>
                <right theme="outline" size="24" fill="#333" />
              </template>
              上一页
            </n-button>
            <n-button icon-placement="right" v-show="articleLength === 10">
              下一页
              <template #icon>
                <right theme="outline" size="24" fill="#333" />
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </n-page-header>
  </div>
</template>

<script setup lang="ts" name="Search">
import { NList, NThing, NListItem, NSpace, NTag, NButton, NEmpty } from "naive-ui";
import { ref, onMounted, computed, watch } from "vue";
import { getArticleSearch } from "@/services/article";
import { Right } from "@icon-park/vue-next";
import { useRouter, useRoute } from "vue-router";
import { colorIndex } from "@/common/article";
import { calculationTime } from "@/utils/date";

const colorRef = ref<{ time?: boolean; read?: boolean }>({ time: true });
const router = useRouter();
const route = useRoute();
const data = ref<API.Article[]>([]);
const page = ref<number>(1);
const articleLength = computed(() => data.value.length);

const changeSort = async (v: string) => {
  if (data.value.length === 0) {
    colorRef.value = { [v]: true };
  }
  const response = await getArticleSearch({ page: 1, ...route.params, sort: v });
  if (response?.code === 200) {
    data.value = response.data?.list || [];
    colorRef.value = { [v]: true };
  }
};

const changeUrl = (id: number) => {
  router.push(`/articles/${id}`);
};

const changeLookOther = () => {
  router.push("/articles");
};

const handleBack = () => {
  router.back();
};

onMounted(async () => {
  const sort = Object.keys(colorRef.value)[0];
  const response = await getArticleSearch({ page: 1, ...route.params, sort });
  if (response?.code === 200) {
    data.value = (response.data?.list as API.Article[]) || [];
  }
});

watch(
  () => route.params.value,
  async (changeValue) => {
    if (changeValue) {
      const sort = Object.keys(colorRef.value)[0];
      const response = await getArticleSearch({ page: 1, ...route.params, value: changeValue as string, sort });
      if (response?.code === 200) {
        data.value = response.data?.list || [];
      }
    }
  },
);
</script>

<style scoped lang="less">
.article-list {
  margin: auto 25%;
}

.pageNext {
  margin: 15px 0 45px 0;
}

.sortH4 {
  a {
    color: #999999;
  }

  a:hover {
    color: #70a1ff;
  }
}
</style>
