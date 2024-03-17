<template>
  <n-drawer
    v-model:show="props.active"
    :width="502"
    placement="right"
    v-bind:on-update:show="changeStatus"
  >
    <n-drawer-content title="个人信息">
      <template #footer>
        <div>
          <NButton type="primary" @click="submit" :loading="loading">
            提交
          </NButton>
        </div>
      </template>

      <n-form
        ref="formRef"
        :model="userInfo"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="头像" path="header">
          <n-upload
            accept=".png,.jpg,.jpeg,.git"
            list-type="image-card"
            :file-list="fileList"
            :max="1"
            v-bind:on-change="onChangeFile"
            :custom-request="changeCustomRequest"
          ></n-upload>
        </n-form-item>
        <n-form-item label="账号" path="name">
          <n-input v-model:value="userInfo.userName" placeholder="账号" />
        </n-form-item>
        <n-form-item label="简介" path="introduction">
          <n-input v-model:value="userInfo.introduction" placeholder="简介" />
        </n-form-item>
        <n-form-item label="介绍" path="content">
          <n-input v-model:value="userInfo.content" placeholder="介绍" />
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
export default {
  name: "Person",
  data() {
    return {
      rules: {},
    };
  },
};
</script>

<script lang="ts" name="Person" setup>
import { ref, watch } from "vue";
import type {
  FormInst,
  UploadFileInfo,
  UploadCustomRequestOptions,
} from "naive-ui";
import { useUserStore } from "@/stores/user";
import { Base_URL } from "@/common/article";
import { uploadFile } from "@/services/fileUpload";
import { updateUser } from "@/services/user";

const props = defineProps<{ active: boolean }>();
const emits = defineEmits<{ (e: "changeStatus", status: boolean): void }>();
const changeStatus = (show: boolean) => {
  emits("changeStatus", show);
};

const loading = ref<boolean>(false);
const formRef = ref<FormInst | null>(null);
const userStore = useUserStore();

const userInfo = ref<User.UserInfo>(userStore.currentUser.user);

const fileList = ref<UploadFileInfo[]>([
  {
    id: "a",
    name: "头像.png",
    status: "finished",
    url: Base_URL + userStore.currentUser.user.headerImg,
  },
]);

watch(
  () => userStore.currentUser.user,
  () => {
    userInfo.value = userStore.currentUser.user;
    fileList.value = [
      {
        id: "a",
        name: "头像.png",
        status: "finished",
        url: Base_URL + userStore.currentUser.user.headerImg,
      },
    ];
  },
  { immediate: true }
);

const changeCustomRequest = (options: UploadCustomRequestOptions) => {
  const formData = new FormData();
  formData.append("file", options.file.file as File, options.file.name);
  uploadFile(formData)
    .then((resp) => {
      if (resp.code === 0) {
        window.$message.success("上传成功");
        userStore.currentUser.user.headerImg = resp.data?.file.url as string;
      }
    })
    .catch((e) => {
      window.$message.error("上传失败");
    });
};

const onChangeFile = async (e: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  fileList.value = e.fileList;
};

const submit = () => {
  loading.value = true;
  updateUser(userInfo.value)
    .then((resp) => {
      if (resp.code === 0) {
        emits("changeStatus", false);
        window.$message.success("更新个人信息成功");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped lang="less"></style>
