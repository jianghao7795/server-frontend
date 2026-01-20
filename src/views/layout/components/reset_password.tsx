import { defineComponent, ref } from "vue";
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton } from "naive-ui";
import type { FormInst, FormItemRule } from "naive-ui";
import { useUserStore } from "@/stores/user";
import { resetPassword } from "@/services/user";

export default defineComponent({
  name: "ResetPassword",
  props: {
    active: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["changeStatus", "resetStore"],
  setup(props, { emit }) {
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
            emit("resetStore");
            emit("changeStatus", false);
            formRef.value?.restoreValidation();
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
      return (
        !!userPassword.value.new_password &&
        userPassword.value.new_password.startsWith(value) &&
        userPassword.value.new_password.length >= value.length
      );
    }
    function validatePasswordSame(rule: FormItemRule, value: string): boolean {
      return value === userPassword.value.new_password;
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
          trigger: ["input", "blur"],
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

    return () => {
      return (
        <NDrawer show={props.active} onUpdate:show={(e: boolean) => emit("changeStatus", e)} width={502} placement="right">
          <NDrawerContent title="修改密码">
            <NForm
              ref={formRef}
              model={userPassword.value}
              rules={rules}
              labelPlacement="left"
              labelWidth="auto"
              requireMarkPlacement="right-hanging"
              size="large"
            >
              <NFormItem path="name">
                <NInput
                  type="password"
                  showPasswordOn="click"
                  value={userPassword.value.password}
                  onUpdate:value={(val: string) => (userPassword.value.password = val)}
                  placeholder="密码"
                />
              </NFormItem>
              <NFormItem path="password">
                <NInput
                  type="password"
                  showPasswordOn="click"
                  value={userPassword.value.new_password}
                  onUpdate:value={(val: string) => (userPassword.value.new_password = val)}
                  placeholder="新密码"
                />
              </NFormItem>
              <NFormItem path="password">
                <NInput
                  type="password"
                  showPasswordOn="click"
                  value={userPassword.value.repeat_new_password}
                  onUpdate:value={(val: string) => (userPassword.value.repeat_new_password = val)}
                  placeholder="重复新密码"
                />
              </NFormItem>
              <div>
                <NButton loading={loading.value} type="primary" block={true} onClick={submit}>
                  提交
                </NButton>
              </div>
            </NForm>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
