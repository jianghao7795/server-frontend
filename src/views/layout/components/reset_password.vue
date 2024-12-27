<template>
  <n-drawer
    v-model:show="props.active"
    :width="502"
    placement="right"
    :on-update:show="(e) => emits('changeStatus', e)"
  >
    <n-drawer-content title="修改密码">
      <n-form
        ref="formRef"
        :model="userPassword"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="large"
      >
        <n-form-item path="name">
          <n-input type="password" show-password-on="click" v-model:value="userPassword.password" placeholder="密码" />
        </n-form-item>
        <n-form-item path="password">
          <n-input
            type="password"
            show-password-on="click"
            v-model:value="userPassword.new_password"
            placeholder="新密码"
          />
        </n-form-item>
        <n-form-item path="password">
          <n-input
            type="password"
            show-password-on="click"
            v-model:value="userPassword.repeat_new_password"
            placeholder="重复新密码"
          />
        </n-form-item>
        <div>
          <n-button :loading="loading" type="primary" :block="true" @click="submit">提交</n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts" name="ResetPassword">
import { ref } from "vue";
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton } from "naive-ui";
import type { FormInst, FormItemRule } from "naive-ui";
import { useUserStore } from "@/stores/user";
import { resetPassword } from "@/services/user";

const props = defineProps<{ active: boolean }>();
const emits = defineEmits<{ (e: "changeStatus", b: boolean): void; (e: "resetStore"): void }>();
const loading = ref<boolean>(false);
const formRef = ref<FormInst | null>(null);

const userStore = useUserStore();
const userPassword = ref({
  password: "",
  new_password: "",
  repeat_new_password: "",
});

const submit = () => {
  loading.value = true;
  resetPassword({ ...userPassword.value, id: userStore.currentUser.user.ID })
    .then((resp) => {
      if (resp.code === 200) {
        window.$message.success(resp.msg);
        emits("resetStore");
        emits("changeStatus", false);
        formRef.value?.restoreValidation();
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!userPassword.value.password &&
    userPassword.value.password.startsWith(value) &&
    userPassword.value.password.length >= value.length
  );
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === userPassword.value.password;
}

const rules = {
  password: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入账号",
  },
  newPassword: [
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
  resetPassword: [
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

<style lang="less"></style>
