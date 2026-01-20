import { defineComponent, ref, onMounted } from "vue";
import { NList, NThing, NListItem, NSpace, NTag, NButton, NEmpty, NDivider } from "naive-ui";
import { getArticleList } from "@/services/article";
import { PreviewOpen, StopwatchStart, UserBusiness } from "@icon-park/vue-next";
import { useRouter } from "vue-router";
import { colorIndex } from "@/common/article";
import { calculationTime } from "@/utils/date";
import styles from "./index.module.less";

export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();
    const data = ref<API.Article[]>([]);

    const changeUrl = (id: number) => {
      router.push(`/articles/${id}`);
    };

    const changeLookOther = () => {
      router.push("/articles");
    };

    onMounted(async () => {
      const response = await getArticleList({ page: 1, is_important: 1 });
      if (response?.code === 200) {
        data.value = response.data?.list as API.Article[];
      }
    });

    return () => {
      if (data.value.length === 0) {
        return (
          <div class={styles.articleList}>
            <NEmpty size="large" description="首页暂无">
              {{
                extra: () => (
                  <NButton size="small" type="primary" onClick={changeLookOther}>
                    看看别的文章
                  </NButton>
                ),
              }}
            </NEmpty>
          </div>
        );
      }

      return (
        <div class={styles.articleList}>
          <NList hoverable clickable>
            {data.value.map((item) => (
              <NListItem key={item.ID}>
                <div onClick={() => changeUrl(item.ID)} style={{ cursor: 'pointer' }}>
                  <NThing contentStyle="margin-top: 10px;">
                    {{
                      header: () => (
                        <div>
                          <h1 title={item.title} class="post-title">{item.title}</h1>
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
                          <NTag key={i.ID} bordered={false} size="small" type={colorIndex(i.ID)}>
                            {i.name}
                          </NTag>
                        ))}
                      </NSpace>
                    ),
                  }}
                </NThing>
                </div>
              </NListItem>
            ))}
          </NList>
        </div>
      );
    };
  },
});
