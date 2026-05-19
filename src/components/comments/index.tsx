import { defineComponent, ref, computed, type PropType, type VNode } from "vue";
import { NAvatar, NButton, NInput, NSpace, NPopover } from "naive-ui";
import dayjs from "dayjs";
import { useUserStore } from "@/stores/user";
import { createdComment, likeComment, unlikeComment } from "@/services/comment";
import emoji from "@/common/emoji";
import styles from "./index.module.less";

const Base_URL = import.meta.env.VITE_BASE_API + "/";
const PAGE_SIZE = 5;
const EMOJI_MAP = emoji.allEmoji as Record<string, string>;
const EMOJI_CODES = Object.keys(EMOJI_MAP);
const EMOJI_REGEX = /\[[^\]]+\]/g;

export default defineComponent({
  name: "CommentSection",
  props: {
    articleId: { type: Number, required: true },
    comments: {
      type: Array as PropType<Comment.comment[]>,
      default: () => [],
    },
  },
  emits: ["refresh"],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const content = ref("");
    const replyId = ref<number | null>(null);
    const replyContent = ref("");
    const replyToUser = ref("");
    const expandedChildren = ref(new Set<number>());
    const visibleCount = ref(PAGE_SIZE);
    const showEmoji = ref(false);
    const showReplyEmoji = ref(false);

    const currentUser = computed(() => userStore.currentUser?.user);
    const isLoggedIn = computed(() => !!userStore.currentUser?.token);

    const visibleComments = computed(() =>
      props.comments.slice(0, visibleCount.value),
    );
    const hasMore = computed(() => props.comments.length > visibleCount.value);

    const avatarUrl = (headerImg?: string) =>
      headerImg ? Base_URL + headerImg : "";

    const formatDate = (date?: string) =>
      date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "";

    const insertEmoji = (code: string, target: "main" | "reply") => {
      if (target === "main") {
        content.value += code;
        showEmoji.value = false;
      } else {
        replyContent.value += code;
        showReplyEmoji.value = false;
      }
    };

    const renderContent = (text: string): VNode[] => {
      if (!text) return [];
      const parts = text.split(EMOJI_REGEX);
      const matches = text.match(EMOJI_REGEX) || [];
      const result: VNode[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) result.push(<span>{parts[i]}</span>);
        if (matches[i]) {
          const src = EMOJI_MAP[matches[i]];
          if (src) {
            result.push(
              <img src={src} class={styles.emojiImg} alt={matches[i]} />,
            );
          } else {
            result.push(<span>{matches[i]}</span>);
          }
        }
      }
      return result;
    };

    const emojiPanel = (
      <div class={styles.emojiPanel}>
        {EMOJI_CODES.map((code) => (
          <span
            class={styles.emojiItem}
            key={code}
            title={code}
            onClick={(e: MouseEvent) => {
              const target =
                (e.currentTarget as HTMLElement).dataset.target === "reply"
                  ? "reply"
                  : "main";
              insertEmoji(code, target);
            }}
          >
            <img src={EMOJI_MAP[code]} alt={code} />
          </span>
        ))}
      </div>
    );

    const toggleChildren = (id: number) => {
      if (expandedChildren.value.has(id)) {
        expandedChildren.value.delete(id);
      } else {
        expandedChildren.value.add(id);
      }
    };

    const loadMore = () => {
      visibleCount.value += PAGE_SIZE;
    };

    const collapseAll = () => {
      visibleCount.value = PAGE_SIZE;
    };

    const submitComment = async () => {
      if (!content.value.trim()) return;
      if (!isLoggedIn.value) {
        window.$message.warning("请先登录");
        return;
      }
      const resp = await createdComment({
        article_id: props.articleId,
        parent_id: 0,
        content: content.value,
        user_id: currentUser.value!.ID,
        to_user_id: 0,
      });
      if (resp?.code === 200) {
        window.$message.success("评论成功");
        content.value = "";
        emit("refresh");
      }
    };

    const startReply = (item: Comment.comment) => {
      replyId.value = item.ID;
      replyToUser.value = item.user?.nickName || item.user?.userName || "";
      replyContent.value = "";
    };

    const cancelReply = () => {
      replyId.value = null;
      replyContent.value = "";
    };

    const submitReply = async (parent: Comment.comment) => {
      if (!replyContent.value.trim()) return;
      if (!isLoggedIn.value) {
        window.$message.warning("请先登录");
        return;
      }
      const resp = await createdComment({
        article_id: props.articleId,
        parent_id: parent.ID,
        content: replyContent.value,
        user_id: currentUser.value!.ID,
        to_user_id: parent.user_id,
      });
      if (resp?.code === 200) {
        window.$message.success("回复成功");
        replyId.value = null;
        replyContent.value = "";
        emit("refresh");
      }
    };

    const isLiked = (item: Comment.comment) => {
      if (!isLoggedIn.value) return false;
      const uid = currentUser.value!.ID;
      return item.praises?.some((p) => p.user_id === uid) ?? false;
    };

    const handleLike = async (item: Comment.comment) => {
      if (!isLoggedIn.value) {
        window.$message.warning("请先登录");
        return;
      }
      const liked = isLiked(item);
      const resp = liked
        ? await unlikeComment(item.ID)
        : await likeComment(item.ID);
      if (resp?.code === 200) {
        window.$message.success(liked ? "已取消点赞" : "点赞成功");
        emit("refresh");
      }
    };

    const renderChildren = (item: Comment.comment) => {
      if (!item.children?.length) return null;
      const expanded = expandedChildren.value.has(item.ID);
      const count = item.children.length;
      return (
        <div class={styles.childrenSection}>
          <div class={styles.toggleBtn} onClick={() => toggleChildren(item.ID)}>
            <span>
              {expanded ? "收起" : `展开 ${count} 条回复`}
            </span>
          </div>
          {expanded && (
            <div class={styles.childrenList}>
              {item.children.map((child) => renderItem(child, true))}
            </div>
          )}
        </div>
      );
    };

    const renderItem = (item: Comment.comment, isChild = false) => (
      <div
        class={[styles.commentItem, isChild && styles.childComment]}
        key={item.ID}
      >
        <div class={styles.commentBody}>
          <NAvatar
            round
            size="small"
            src={avatarUrl(item.user?.headerImg)}
            object-fit="cover"
          >
            {{ fallback: () => <img src="/tx.jpg" alt="avatar" /> }}
          </NAvatar>
          <div class={styles.commentContent}>
            <div class={styles.commentHeader}>
              <span class={styles.userName}>
                {item.user?.nickName || item.user?.userName}
              </span>
              {item.to_user?.ID !== 0 && (
                <span class={styles.replyTo}>
                  回复{" "}
                  <span class={styles.toUserName}>
                    {item.to_user.nickName || item.to_user.userName}
                  </span>
                </span>
              )}
              <span class={styles.commentTime}>
                {formatDate(item.createdAt)}
              </span>
            </div>
            <div class={styles.commentText}>{renderContent(item.content)}</div>
            <div class={styles.commentActions}>
              <NSpace>
                <NButton text size="tiny" onClick={() => startReply(item)}>
                  回复
                </NButton>
                <NButton
                  text
                  size="tiny"
                  onClick={() => handleLike(item)}
                  type={isLiked(item) ? "primary" : "default"}
                >
                  {{
                    icon: () => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={isLiked(item) ? "currentColor" : "none"}
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      </svg>
                    ),
                    default: () =>
                      `${item.praises?.length > 0 ? ` ${item.praises.length}` : ""}`,
                  }}
                </NButton>
              </NSpace>
            </div>
            {replyId.value === item.ID && (
              <div class={styles.replyInput}>
                <NInput
                  placeholder={`回复 ${replyToUser.value}...`}
                  size="small"
                  style="flex: 1"
                  value={replyContent.value}
                  onUpdate:value={(val: string) => (replyContent.value = val)}
                  onKeydown={(e: KeyboardEvent) => {
                    if (e.key === "Enter") submitReply(item);
                  }}
                />
                <NPopover
                  trigger="click"
                  show={showReplyEmoji.value}
                  onUpdate:show={(val: boolean) => (showReplyEmoji.value = val)}
                >
                  {{
                    trigger: () => (
                      <NButton
                        size="tiny"
                        onClick={() => (showReplyEmoji.value = !showReplyEmoji.value)}
                      >
                        {{
                          icon: () => (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                              <line x1="9" y1="9" x2="9.01" y2="9" />
                              <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                          ),
                        }}
                      </NButton>
                    ),
                    default: () => (
                      <div
                        class={styles.emojiPanel}
                        data-target="reply"
                        onClick={(e: Event) => {
                          const el = (e.target as HTMLElement).closest(
                            `[data-code]`,
                          ) as HTMLElement | null;
                          if (el?.dataset.code) {
                            insertEmoji(el.dataset.code, "reply");
                          }
                        }}
                      >
                        {EMOJI_CODES.map((code) => (
                          <span
                            class={styles.emojiItem}
                            key={code}
                            title={code}
                            data-code={code}
                          >
                            <img src={EMOJI_MAP[code]} alt={code} />
                          </span>
                        ))}
                      </div>
                    ),
                  }}
                </NPopover>
                <NSpace>
                  <NButton
                    size="tiny"
                    type="primary"
                    onClick={() => submitReply(item)}
                  >
                    提交
                  </NButton>
                  <NButton size="tiny" onClick={cancelReply}>
                    取消
                  </NButton>
                </NSpace>
              </div>
            )}
          </div>
        </div>
        {renderChildren(item)}
      </div>
    );

    return () => (
      <div class={styles.commentSection}>
        <h2>评论</h2>
        {isLoggedIn.value ? (
          <div class={styles.inputWrapper}>
            <NInput
              placeholder="说点什么..."
              value={content.value}
              onUpdate:value={(val: string) => (content.value = val)}
              type="textarea"
              autosize={{ minRows: 2, maxRows: 4 }}
            />
            <div class={styles.submitBtn}>
              <NPopover
                trigger="click"
                show={showEmoji.value}
                onUpdate:show={(val: boolean) => (showEmoji.value = val)}
              >
                {{
                  trigger: () => (
                    <NButton
                      size="small"
                      class={styles.emojiBtn}
                      onClick={() => (showEmoji.value = !showEmoji.value)}
                    >
                      {{
                        icon: () => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                          </svg>
                        ),
                      }}
                    </NButton>
                  ),
                  default: () => (
                    <div
                      class={styles.emojiPanel}
                      data-target="main"
                      onClick={(e: Event) => {
                        const el = (e.target as HTMLElement).closest(
                          `[data-code]`,
                        ) as HTMLElement | null;
                        if (el?.dataset.code) {
                          insertEmoji(el.dataset.code, "main");
                        }
                      }}
                    >
                      {EMOJI_CODES.map((code) => (
                        <span
                          class={styles.emojiItem}
                          key={code}
                          title={code}
                          data-code={code}
                        >
                          <img src={EMOJI_MAP[code]} alt={code} />
                        </span>
                      ))}
                    </div>
                  ),
                }}
              </NPopover>
              <NButton type="primary" size="small" onClick={submitComment}>
                发表评论
              </NButton>
            </div>
          </div>
        ) : (
          <div class={styles.loginTip}>请先登录后再发表评论</div>
        )}
        <div class={styles.commentList}>
          {props.comments.length === 0 ? (
            <div class={styles.empty}>暂无评论，快来抢沙发吧~</div>
          ) : (
            visibleComments.value.map((item) => renderItem(item))
          )}
        </div>
        {hasMore.value && (
          <div class={styles.loadMore}>
            <NSpace>
              <NButton text type="primary" onClick={loadMore}>
                加载更多评论
              </NButton>
              <NButton text onClick={collapseAll}>
                收起
              </NButton>
            </NSpace>
          </div>
        )}
      </div>
    );
  },
});
