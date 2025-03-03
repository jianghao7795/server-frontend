import type { MessageProviderInst, NotificationProviderInst, LoadingBarProviderInst } from "naive-ui";

declare global {
  interface Window {
    $message: MessageProviderInst;
    $notification: NotificationProviderInst;
    $loadingBar: LoadingBarProviderInst;
  }
}
