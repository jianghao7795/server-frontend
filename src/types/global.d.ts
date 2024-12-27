import type { MessageProviderInst, NotificationProviderInst, LoadingBarProviderInst } from "naive-ui";

declare global {
  interface Window {
    $message: MessageProviderInst;
    $notification: NotificationProviderInst;
    $loadingBar: LoadingBarProviderInst;
  }
}
declare namespace Global {
  export type Response<T> = {
    code: 200 | 400 | 401 | 403 | 404 | 500;
    data: T;
    msg: string;
  };

  export type ResponseAbout<T> = {
    code: 200 | 400 | 401 | 403 | 404 | 500;
    data?: T;
    msg: string;
  };
}
