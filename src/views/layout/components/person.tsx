import { defineComponent, ref, watch } from "vue";
import { NInput, NForm, NFormItem, NUpload, NDrawer, NDrawerContent, NButton } from "naive-ui";
import type { FormInst, UploadFileInfo, UploadCustomRequestOptions } from "naive-ui";
import { useUserStore } from "@/stores/user";
import { Base_URL } from "@/common/article";
import { uploadFile } from "@/services/fileUpload";
import { updateUser } from "@/services/user";

export default defineComponent({
  name: "Person",
  props: {
    active: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["changeStatus"],
  setup(props, { emit }) {
    const changeStatus = (show: boolean) => {
      emit("changeStatus", show);
    };

    const rules = ref({});
    const loading = ref<boolean>(false);
    const formRef = ref<FormInst | null>(null);
    const userStore = useUserStore();

    const userInfo = ref<User.UserInfo>(userStore.currentUser.user);

    const fileList = ref<UploadFileInfo[]>([
      {
        id: "a",
        name: "头像.png",
        status: "finished",
        url: Base_URL + userStore.currentUser.user?.headerImg,
      },
    ]);

    watch(
      () => userStore.currentUser.user,
      () => {
        userInfo.value = userStore.currentUser?.user;
        fileList.value = [
          {
            id: "a",
            name: "头像.png",
            status: "finished",
            url: Base_URL + userStore.currentUser?.user?.headerImg,
          },
        ];
      },
      { immediate: true },
    );

    const changeCustomRequest = (options: UploadCustomRequestOptions) => {
      const formData = new FormData();
      formData.append("file", options.file.file as File, options.file.name);
      formData.append("is_cropper", "3");
      uploadFile(formData)
        .then((resp) => {
          if (resp.code === 200) {
            window.$message.success("上传成功");
            userStore.currentUser.user.headerImg = resp.data?.file.url as string;
          }
        })
        .catch(() => {
          window.$message.error("上传失败");
        });
    };

    const onChangeFile = async (e: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
      fileList.value = e.fileList;
    };

    const submit = () => {
      loading.value = true;
      updateUser(userInfo.value)
        .then((resp) => {
          if (resp.code === 200) {
            emit("changeStatus", false);
            window.$message.success("更新个人信息成功");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return () => {
      return (
        <NDrawer show={props.active} onUpdate:show={changeStatus} width={502} placement="right">
          <NDrawerContent title="个人信息">
            {{
              footer: () => (
                <div>
                  <NButton type="primary" onClick={submit} loading={loading.value}>
                    提交
                  </NButton>
                </div>
              ),
              default: () => (
                <NForm
                  ref={formRef}
                  model={userInfo.value}
                  rules={rules.value}
                  labelPlacement="left"
                  labelWidth="auto"
                  requireMarkPlacement="right-hanging"
                >
                  <NFormItem label="头像" path="header">
                    <NUpload
                      accept=".png,.jpg,.jpeg,.git"
                      listType="image-card"
                      fileList={fileList.value}
                      max={1}
                      onChange={onChangeFile}
                      customRequest={changeCustomRequest}
                    />
                  </NFormItem>
                  <NFormItem label="账号" path="name">
                    <NInput
                      value={userInfo.value.userName}
                      onUpdate:value={(val: string) => (userInfo.value.userName = val)}
                      placeholder="账号"
                    />
                  </NFormItem>
                  <NFormItem label="简介" path="introduction">
                    <NInput
                      value={userInfo.value.introduction}
                      onUpdate:value={(val: string) => (userInfo.value.introduction = val)}
                      placeholder="简介"
                    />
                  </NFormItem>
                  <NFormItem label="介绍" path="content">
                    <NInput
                      value={userInfo.value.content}
                      onUpdate:value={(val: string) => (userInfo.value.content = val)}
                      placeholder="介绍"
                    />
                  </NFormItem>
                </NForm>
              ),
            }}
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
