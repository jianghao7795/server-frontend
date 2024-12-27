<template>
  <div class="article-list">
    <n-list clickable hoverable v-bind:style="{ marginButton: 10 }">
      <n-list-item v-for="item in article.list" :key="item.ID">
        <n-thing content-style="margin-top: 10px">
          <template #header>
            <div>
              <h1 class="post-title" @click="changeUrl(item.ID)">{{ item.title }}</h1>
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
              <n-tag v-for="i in item.tags" :key="i.ID" :bordered="false" :type="colorIndex(i.ID)" size="small">
                {{ i.name }}
              </n-tag>
            </n-space>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
    <div class="article-list-more">
      <n-button block secondary strong v-show="article.showMore" @click="changePage">{{ isMore }}</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="Article">
import { NList, NThing, NListItem, NSpace, NTag, NButton, NDivider } from "naive-ui";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { colorIndex } from "@/common/article";
import { useArticleStore } from "@/stores/article";
import { calculationTime } from "@/utils/date";
import { UserBusiness, StopwatchStart, PreviewOpen } from "@icon-park/vue-next";

const article = useArticleStore();
const router = useRouter();

const isMore = computed(() => {
  if (article.loading) {
    return "加载中...";
  }
  return "查看更多";
});

const changeUrl = (id: number) => {
  router.push(`/articles/${id}`);
};

const changePage = () => {
  article.getList({ pageSize: 10 });
};

onMounted(async () => {
  if (article.list.length === 0) {
    try {
      await article.getList({ pageSize: 10 });
    } catch (e) {
      console.log(e);
    }
  }
});
</script>

<style lang="less" scoped>
.article-list {
  margin: auto 25%;
}

.article-list-more {
  width: 100%;
  text-align: center;
  border: 1px;
}

.page {
  margin: 50px;
  display: flex;
  justify-content: flex-end;
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
