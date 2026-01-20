import { defineComponent, onMounted, inject, ref, type Ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NAvatar,
  NTag,
  NSpace,
  NDivider,
  NCollapse,
  NCollapseItem,
  NPageHeader,
  NInput,
} from "naive-ui";
import { colorIndex } from "@/common/article";
import dayjs from "dayjs";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useArticleStore } from "@/stores/article";
import type { GlobalTheme } from "naive-ui";
import { createdComment } from "@/services/comment";
import styles from "./detail.module.less";

const Base_URL = import.meta.env.VITE_BASE_API + "/";

export default defineComponent({
  name: "ArticleDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const theme = inject<Ref<GlobalTheme | null>>("theme");
    const articleStore = useArticleStore();
    const avatar = computed(() =>
      articleStore.detail?.user?.headerImg
        ? Base_URL + articleStore.detail?.user?.headerImg
        : "",
    );
    const commentString = ref<string>("");
    const scrollScreen = ref<HTMLElement | null>(null);

    const submit = async () => {
      const resp = await createdComment({
        article_id: articleStore.detail.ID,
        parent_id: 0,
        content: commentString.value,
        user_id: articleStore.detail.user_id,
        to_user_id: 0,
      });

      if (resp?.code === 200) {
        window.$message.success("评论成功");
        const params = route.params;
        articleStore.getComment({ id: Number(params.id).valueOf() });
        commentString.value = "";
      }
    };

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

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        submit();
      }
    };

    onMounted(async () => {
      const params = route.params;
      articleStore.getDetail({ id: Number(params.id).valueOf() });
    });

    return () => {
      return (
        <div class="view-content">
          <NPageHeader onBack={handleBack}>
            <div class="view-margin" ref={scrollScreen}>
              <h1 class="view-center">
                <b>{articleStore.detail?.title}</b>
              </h1>
              <h3>简介：{articleStore.detail?.desc}</h3>
              <h4>
                <NSpace style="width: 80%">
                  标签：
                  {articleStore.detail?.tags?.map((item, index) => (
                    <NTag size="small" round type={colorIndex(index)}>
                      {item.name}
                    </NTag>
                  ))}
                </NSpace>
              </h4>

              <NSpace vertical>
                <div class={styles.imgTxt}>
                  作者：
                  <NAvatar
                    round
                    size="small"
                    src={avatar.value}
                    object-fit="cover"
                  >
                    {{
                      fallback: () => <img src="/tx.jpg" alt="avatar" />,
                    }}
                  </NAvatar>
                  &nbsp;
                  {articleStore.detail?.user?.userName}
                </div>
                <div>日期：{changeDate(articleStore.detail?.CreatedAt)}</div>
                <div>阅读量：{articleStore.detail?.reading_quantity}</div>
                <div>{articleStore.detail?.desc}</div>
              </NSpace>

              <NDivider />
              <MdPreview
                {...({
                  modelValue: articleStore.detail?.content || "",
                  theme: theme?.value ? "dark" : "light",
                  pageFullscreen: false,
                  preview: true,
                  readOnly: true,
                  showCodeRowNumber: true,
                  previewOnly: true,
                } as any)}
              />
            </div>
          </NPageHeader>
          <div class="view-margin">
            <h1>评论</h1>
            <h3>
              <NInput
                placeholder="规则表达"
                onKeydown={handleKeydown}
                size="small"
                style="width: 100%"
                value={commentString.value}
                onUpdate:value={(val: string) => (commentString.value = val)}
              />
            </h3>
            <div>
              <NCollapse arrow-placement="right">
                {articleStore.comment?.map((item) => (
                  <NCollapseItem name={item.ID} key={item.ID}>
                    {{
                      header: () => (
                        <div class={styles.imgTxt}>
                          <span>{item.user.nickName}:</span>
                          <span>{item.content}</span>
                        </div>
                      ),
                      default: () => (
                        <div>
                          {item.children?.map((child) => (
                            <div key={child.ID}>
                              <span>
                                {child.user.nickName} 回复 {child.to_user.nickName}:
                              </span>
                              {child.content}
                            </div>
                          ))}
                        </div>
                      ),
                    }}
                  </NCollapseItem>
                ))}
              </NCollapse>
            </div>
          </div>
        </div>
      );
    };
  },
});
