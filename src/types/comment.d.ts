declare namespace Comment {
  export interface Praise {
    ID: number;
    comment_id: number;
    user_id: number;
    CreatedAt: string;
  }

  export interface comment {
    id: number;
    created_at: string;
    updated_at: string;
    article_id: number;
    article: API.Article;
    parentId: number;
    content: string;
    user_id: number;
    user: User.UserInfo;
    to_user: User.UserInfo;
    to_user_id: number;
    children: comment[];
    praises: Praise[];
  }
  export type createcomment = {
    article_id: number;
    parent_id: number;
    content: string;
    user_id: number;
    to_user_id: number;
  };
}
