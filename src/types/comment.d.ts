declare namespace Comment {
  export interface comment {
    ID: number;
    createdAt: string;
    updatedAt: string;
    article_id: number;
    article: API.Article;
    parentId: number;
    content: string;
    user_id: number;
    user: User.UserInfo;
    to_user: User.UserInfo;
    to_user_id: number;
    children: comment[];
  }
  export type createcomment = {
    article_id: number;
    parent_id: number;
    content: string;
    user_id: number;
    to_user_id: number;
  };
}
