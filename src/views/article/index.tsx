import { defineComponent, onMounted, computed } from "vue";
import { NList, NThing, NListItem, NSpace, NTag, NButton, NDivider } from "naive-ui";
import { useRouter } from "vue-router";
import { colorIndex } from "@/common/article";
import { useArticleStore } from "@/stores/article";
import { calculationTime } from "@/utils/date";
import { UserBusiness, StopwatchStart, PreviewOpen } from "@icon-park/vue-next";
import styles from "./index.module.less";

export default defineComponent({
  name: "Article",
  setup() {
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

    return () => {
      return (
        <div class={styles.articleList}>
          <NList clickable hoverable style={{ marginButton: 10 }}>
            {article.list.map((item) => (
              <NListItem key={item.ID}>
                <NThing contentStyle="margin-top: 10px">
                  {{
                    header: () => (
                      <div>
                        <h1 class="post-title" onClick={() => changeUrl(item.ID)}>
                          {item.title}
                        </h1>
                      </div>
                    ),
                    description: () => (
                      <div class={styles.description}>
                        <UserBusiness
                          theme="outline"
                          size={12}
                          fill="#b4b1b1"
                          strokeLinejoin="miter"
                          strokeLinecap="square"
                        />
                        &nbsp;
                        <a>{item.user.nickName}</a>
                        <NDivider vertical />
                        <StopwatchStart
                          theme="outline"
                          size={12}
                          fill="#b4b1b1"
                          strokeLinejoin="miter"
                          strokeLinecap="square"
                        />
                        &nbsp;
                        <a>{calculationTime(item.CreatedAt)}</a>
                        <NDivider vertical />
                        <PreviewOpen
                          theme="outline"
                          size={16}
                          fill="#b4b1b1"
                          strokeLinejoin="miter"
                          strokeLinecap="square"
                        />
                        &nbsp;
                        <a>{item.reading_quantity.toLocaleString()}</a>
                      </div>
                    ),
                    footer: () => (
                      <NSpace size="small" justify="center">
                        {item.tags.map((i) => (
                          <NTag key={i.ID} bordered={false} type={colorIndex(i.ID)} size="small">
                            {i.name}
                          </NTag>
                        ))}
                      </NSpace>
                    ),
                  }}
                </NThing>
              </NListItem>
            ))}
          </NList>
          <div class={styles.articleListMore}>
            {article.showMore && (
              <NButton block secondary strong onClick={changePage}>
                {isMore.value}
              </NButton>
            )}
          </div>
        </div>
      );
    };
  },
});
