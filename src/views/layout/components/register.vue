<template>
  <n-drawer v-model:show="props.registerStatus" :width="502" placement="left" :on-update:show="(show: boolean) => emits('changeStatus', show)">
    <n-drawer-content title="注册" closable>
      <n-form ref="formRef" :model="userRegister" :rules="rules" label-placement="left" label-width="auto" require-mark-placement="right-hanging" size="large">
        <n-form-item path="name">
          <n-input type="text" v-model:value="userRegister.name" :clearable="true" placeholder="账号" />
        </n-form-item>
        <n-form-item path="password">
          <n-input :clearable="true" type="password" :minlength="6" show-password-on="click" v-model:value="userRegister.password" placeholder="密码" />
        </n-form-item>
        <n-form-item path="re_password">
          <n-input type="password" :clearable="true" show-password-on="click" v-model:value="userRegister.re_password" placeholder="重复密码" />
        </n-form-item>
        <n-form-item path="introduction">
          <n-input type="text" v-model:value="userRegister.introduction" placeholder="简介" :clearable="true" />
        </n-form-item>
        <n-form-item path="content">
          <n-input
            type="textarea"
            v-model:value="userRegister.content"
            placeholder="介绍"
            :autosize="{
              minRows: 3,
            }"
            :clearable="true"
          />
        </n-form-item>
        <n-form-item>
          <n-upload
            accept=".png,.jpg,.git,.jpeg"
            :file-list="fileList"
            list-type="image-card"
            :max="1"
            v-bind:on-change="changeFileUpload"
            response-type="json"
            file-list-style="border-radius: '50%'"
            :custom-request="requestFile"
          >
            头像
          </n-upload>
        </n-form-item>
        <div>
          <n-button :loading="userStore.loadingRegister" type="primary" :block="true" @click="() => register()">注册</n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts" name="Register">
import { ref } from "vue"; // defineExpose 组件暴露自己的属性
import { useUserStore } from "@/stores/user";
import type { FormItemRule, UploadFileInfo, UploadCustomRequestOptions } from "naive-ui";
import { uploadFile } from "@/services/fileUpload";
const props = defineProps<{
  registerStatus: boolean;
}>();
const emits = defineEmits<{
  (e: "changeStatus", status: boolean): void;
}>();
const userRegister = ref<User.Register>({
  name: "admin_user",
  password: "123456",
  content: "",
  introduction: "",
  re_password: "",
  header: "",
});
const fileList = ref<UploadFileInfo[]>([]);

const changeFileUpload = (options: { file: UploadFileInfo; fileList: Array<UploadFileInfo>; event?: Event }) => {
  fileList.value = options.fileList;
};

const requestFile = (options: UploadCustomRequestOptions) => {
  const formData = new FormData();
  formData.append("file", options.file.file as File, options.file.name);
  uploadFile(formData)
    .then((resp) => {
      if (resp.code === 200) {
        window.$message.success("上传成功");
        userRegister.value.header = resp.data?.file.url as string;
      }
    })
    .catch((e) => {
      console.log(e);
      window.$message.error("上传失败");
    });
};

const userStore = useUserStore();
const register = () => {
  userStore.register(userRegister.value as User.Register, () => {
    emits("changeStatus", false);
    userRegister.value = {
      name: "",
      password: "",
      content: "",
      introduction: "",
      re_password: "",
      header: "",
    };
    window.$message.success("注册成功，请登录");
  });
};

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return !!userRegister.value.password && userRegister.value.password.startsWith(value) && userRegister.value.password.length >= value.length;
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === userRegister.value.password;
}

const rules = {
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入账号",
  },
  password: [
    {
      required: true,
      trigger: ["blur", "input"],
      message: "请输入密码",
    },
    {
      min: 6,
      message: "密码最小6位",
      trigger: ["input", "blur"], // 触发方式
    },
  ],
  re_password: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: ["input", "blur"],
    },
    {
      validator: validatePasswordStartWith,
      message: "两次密码输入不一致",
      trigger: "input",
    },
    {
      validator: validatePasswordSame,
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"],
    },
  ],
};
</script>
