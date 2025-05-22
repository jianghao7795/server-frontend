{
  /* <template>
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
</script> */
}

import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getTagList } from "@/services/tag";
import { NSpace, NButton } from "naive-ui";
import { colorIndex } from "@/common/article";

export default defineComponent({
  name: "Tag",
  components: {
    NSpace,
    NButton,
  },
  setup() {
    const router = useRouter();
    const tagList = ref<API.Tag[]>([]);
    onMounted(async () => {
      const resp = await getTagList();
      tagList.value = resp?.data?.list;
    });

    const searchArticle = (name: string) => {
      router.push(`/tags/search/${name}`);
    };

    return () => {
      return (
        <div class="view-content">
          <NSpace>
            {tagList.value.map((item, index) => (
              <NButton key={item.ID} type={colorIndex(index)} onClick={() => searchArticle(item.name)}>
                {item.name}
              </NButton>
            ))}
          </NSpace>
        </div>
      );
    };
  },
});
