<template>
  <div class="article-list">
    <n-list hoverable clickable v-if="data.length !== 0">
      <n-list-item v-for="item in data" :key="item.ID" @click="changeUrl(item.ID)">
        <n-thing content-style="margin-top: 10px;">
          <template #header>
            <div>
              <h1 class="post-title">{{ item.title }}</h1>
            </div>
          </template>
          <template #description>
            <div class="description">
              <user-business theme="outline" size="12" fill="#b4b1b1" strokeLinejoin="miter" strokeLinecap="square" />
              &nbsp;
              <a>{{ item.user.nickName }}</a>
              <n-divider vertical />
              <stopwatch-start theme="outline" size="12" fill="#b4b1b1" strokeLinejoin="miter" strokeLinecap="square" />
              &nbsp;
              <a>{{ calculationTime(item.CreatedAt) }}</a>
              <n-divider vertical />
              <preview-open theme="outline" size="18" fill="#b4b1b1" strokeLinejoin="miter" strokeLinecap="square" />
              &nbsp;
              <a>{{ item.reading_quantity.toLocaleString() }}</a>
            </div>
          </template>
          <!-- <md-editor v-model="item.content" preview-only /> -->
          <template #footer>
            <n-space size="small" justify="center">
              <n-tag :bordered="false" size="small" v-for="i in item.tags" :key="i.ID" :type="colorIndex(i.ID)">
                {{ i.name }}
              </n-tag>
            </n-space>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
    <n-empty size="large" description="首页暂无" v-else>
      <template #extra>
        <n-button size="small" type="primary" @click="changeLookOther">看看别的文章</n-button>
      </template>
    </n-empty>
    <!-- <div class="pageNext">
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
    </div> -->
  </div>
</template>

<script setup lang="ts" name="Home">
import { NList, NThing, NListItem, NSpace, NTag, NButton, NEmpty, NDivider } from "naive-ui";
import { ref, onMounted } from "vue";
import { getArticleList } from "@/services/article";
import { PreviewOpen, StopwatchStart, UserBusiness } from "@icon-park/vue-next";
import { useRouter } from "vue-router";
import { colorIndex } from "@/common/article";
import { calculationTime } from "@/utils/date";

const router = useRouter();

const data = ref<API.Article[]>([]);

const changeUrl = (id: number) => {
  router.push(`/articles/${id}`);
};

onMounted(async () => {
  const response = await getArticleList({ page: 1, is_important: 1 });
  if (response?.code === 200) {
    data.value = response.data?.list as API.Article[];
  }
});

const changeLookOther = () => {
  router.push("/articles");
};
</script>

<style scoped lang="less">
.article-list {
  margin: auto 25%;
}

.pageNext {
  margin: 15px 0 45px 0;
}
.description {
  text-align: center;
  a {
    font-size: 13px;
  }
  .i-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
