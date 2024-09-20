<template>
  <div class="view-content">
    <n-page-header @back="handleBack">
      <!-- <template #title>
        <n-button type="info" v-on:click="handleBack">返回</n-button>
      </template> -->
      <div class="view-margin" ref="scrollScreen">
        <h1 class="view-center">
          <b>{{ articleStore.detail?.title }}</b>
        </h1>
        <h3>简介：{{ articleStore.detail?.desc }}</h3>
        <h4>
          <NSpace style="width: 80%">
            标签：
            <n-tag size="small" round v-for="(item, index) in articleStore.detail?.tags" :type="colorIndex(index)">
              {{ item.name }}
            </n-tag>
          </NSpace>
        </h4>

        <NSpace vertical>
          <div class="img-txt">
            作者：
            <n-avatar round size="small" :src="avatar" object-fit="cover" />
            &nbsp;
            {{ articleStore.detail?.user?.userName }}
          </div>
          <div>日期：{{ changeDate(articleStore.detail?.CreatedAt) }}</div>
          <div>阅读量：{{ articleStore.detail?.reading_quantity }}</div>
          <div>{{ articleStore.detail.desc }}</div>
        </NSpace>

        <n-divider />
        <MdPreview
          :model-value="articleStore.detail?.content"
          :theme="theme ? 'dark' : 'light'"
          :pageFullscreen="false"
          :preview="true"
          :readOnly="true"
          :showCodeRowNumber="true"
          previewOnly
        />
      </div>
    </n-page-header>
    <div class="view-margin">
      <h1>评论</h1>
      <h3><n-input placeholder="规则表达" size="small" style="width: 100%" /></h3>
      <div>
        <n-collapse arrow-placement="right">
          <n-collapse-item v-for="item in comment" :name="item.ID" :key="item.ID">
            <template class="img-txt" #header>
              <div>
                <span>{{ item.user.nickName }}:</span>
                <span>{{ item.content }}</span>
              </div>
            </template>
            <div>
              <div v-for="child in item.children" :key="child.ID">
                <span>{{ child.user.nickName }} 回复 {{ child.to_user.nickName }}:</span>
                {{ child.content }}
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ArticleDetail">
import { onMounted, inject, ref, type Ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { colorIndex } from "@/common/article";
import dayjs from "dayjs";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useArticleStore } from "@/stores/article";
import type { GlobalTheme } from "naive-ui";
import { getArticleComment, createdComment } from "@/services/comment";

const Base_URL = import.meta.env.VITE_BASE_API + "/";
const route = useRoute();
const router = useRouter();
const theme = inject<Ref<GlobalTheme | null>>("theme");
const articleStore = useArticleStore();
const avatar = computed(() => (articleStore.detail?.user?.headerImg ? Base_URL + articleStore.detail?.user?.headerImg : ""));
// const isComment = ref<boolean>(false);
// const isCommentChildren = ref<{ [id: number]: boolean }>({});

const comment = ref<Comment.comment[]>([]);
// const inputRef = ref<string>("");
// const inputChildren = ref<string>("");
// const changeLogin = inject<(status: boolean) => void>("changeLogin");

// const focusInput = (isFouse: boolean) => {
//   isComment.value = isFouse;
// };

// const changeActive = (n: EmojiType.emoji) => {
//   inputSelectRef.value.focus();
//   const selectStart =
//     inputSelectRef.value.getTextareaScrollContainer().selectionStart;
//   // console.log(inputSelectRef.value);
//   inputRef.value =
//     inputRef.value.substring(0, selectStart) +
//     n.char +
//     inputRef.value.substring(selectStart);
// };

// const handleFouces = () => {
//   inputSelectRef.value.focus();
// };

// const reply = (id: number, status: boolean) => {
//   isCommentChildren.value = { [id]: status };
//   // console.log(userStroe.currentUser.user);
// };

// const submit = async (parentId: number, children: Comment.comment[]) => {
//   if (userStroe.currentUser.user.ID === 0) {
//     message.warning("请登录");
//     changeLogin?.(true);
//     return;
//   }
//   if (parentId === 0 && inputRef.value === "") {
//     message.warning("请输入评论");
//     return;
//   }
//   if (parentId !== 0 && inputChildren.value === "") {
//     message.warning("请输入评论");
//     return;
//   }
//   // console.log(inputRef.value);
//   // setTimeout(() => {
//   //   inputRef.value = '';
//   //   focusInput(false);
//   // }, 3000);
//   const resp = await createdComment({
//     content: inputRef.value || inputChildren.value,
//     articleId: Number(route.params.id).valueOf(),
//     parentId,
//     user_id: userStroe.currentUser.user.ID || 0,
//     user_name: userStroe.currentUser.user.nickName || "测试",
//   } as Comment.comment);
//   if (resp?.code === 200) {
//     message.success("评论成功");
//     setTimeout(() => {
//       let child = undefined;
//       if (parentId === 0) {
//         child = [];
//       }
//       isComment.value = false;
//       isCommentChildren.value[parentId] = false;
//       children.unshift({
//         user: userStroe.currentUser.user,
//         content: inputRef.value || inputChildren.value,
//         articleId: Number(route.params.id).valueOf(),
//         parentId,
//         user_id: userStroe.currentUser.user.ID || 0,
//         user_name: userStroe.currentUser.user.nickName || "测试",
//         ID: resp.data.id,
//         children: child,
//       } as Comment.comment);
//       inputRef.value = "";
//       inputChildren.value = "";
//     }, 1000);
//   }
// };

const handleBack = () => {
  if (window.history.length <= 1) {
    router.push({
      path: "/articles",
    });
  } else {
    router.go(-1);
  }
};

const changeDate = (timeData?: string): string => {
  return !!timeData ? dayjs(timeData).format("YYYY-MM-DD") : "";
};

// const scrollTo = (options: {
//   left?: number;
//   top?: number;
//   behavior?: "auto" | "smooth";
// }): void => {
//   // console.log(options);
// };

onMounted(async () => {
  const params = route.params;
  articleStore.getDetail({ id: params.id as string });
  const resp = await getArticleComment({ articleId: params.id as string });
  comment.value = resp.data;
});
</script>

<style scoped>
.img-txt {
  max-height: 34px;
  display: flex;
  align-items: center;
  /*垂直居中*/
}
</style>
