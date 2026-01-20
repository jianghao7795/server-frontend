import { defineComponent, ref } from "vue";
import { useUserStore } from "@/stores/user";
import type { FormItemRule, UploadFileInfo, UploadCustomRequestOptions } from "naive-ui";
import { NDrawer, NDrawerContent, NForm, NFormItem, NUpload, NButton, NInput } from "naive-ui";
import { uploadFile } from "@/services/fileUpload";

export default defineComponent({
  name: "Register",
  props: {
    registerStatus: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["changeStatus"],
  setup(props, { emit }) {
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
        emit("changeStatus", false);
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
      return (
        !!userRegister.value.password &&
        userRegister.value.password.startsWith(value) &&
        userRegister.value.password.length >= value.length
      );
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
          trigger: ["input", "blur"],
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

    return () => {
      return (
        <NDrawer
          show={props.registerStatus}
          onUpdate:show={(show: boolean) => emit("changeStatus", show)}
          width={502}
          placement="left"
        >
          <NDrawerContent title="注册" closable>
            <NForm
              model={userRegister.value}
              rules={rules}
              labelPlacement="left"
              labelWidth="auto"
              requireMarkPlacement="right-hanging"
              size="large"
            >
              <NFormItem path="name">
                <NInput
                  type="text"
                  value={userRegister.value.name}
                  onUpdate:value={(val: string) => (userRegister.value.name = val)}
                  clearable={true}
                  placeholder="账号"
                />
              </NFormItem>
              <NFormItem path="password">
                <NInput
                  clearable={true}
                  type="password"
                  minlength={6}
                  showPasswordOn="click"
                  value={userRegister.value.password}
                  onUpdate:value={(val: string) => (userRegister.value.password = val)}
                  placeholder="密码"
                />
              </NFormItem>
              <NFormItem path="re_password">
                <NInput
                  type="password"
                  clearable={true}
                  showPasswordOn="click"
                  value={userRegister.value.re_password}
                  onUpdate:value={(val: string) => (userRegister.value.re_password = val)}
                  placeholder="重复密码"
                />
              </NFormItem>
              <NFormItem path="introduction">
                <NInput
                  type="text"
                  value={userRegister.value.introduction}
                  onUpdate:value={(val: string) => (userRegister.value.introduction = val)}
                  placeholder="简介"
                  clearable={true}
                />
              </NFormItem>
              <NFormItem path="content">
                <NInput
                  type="textarea"
                  value={userRegister.value.content}
                  onUpdate:value={(val: string) => (userRegister.value.content = val)}
                  placeholder="介绍"
                  autosize={{
                    minRows: 3,
                  }}
                  clearable={true}
                />
              </NFormItem>
              <NFormItem>
                <NUpload
                  accept=".png,.jpg,.git,.jpeg"
                  fileList={fileList.value}
                  listType="image-card"
                  max={1}
                  onChange={changeFileUpload}
                  responseType="json"
                  fileListStyle="border-radius: '50%'"
                  customRequest={requestFile}
                >
                  头像
                </NUpload>
              </NFormItem>
              <div>
                <NButton loading={userStore.loadingRegister} type="primary" block={true} onClick={register}>
                  注册
                </NButton>
              </div>
            </NForm>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
