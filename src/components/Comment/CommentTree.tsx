import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CommentItem } from "../../interfaces/blog";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import formatDateTime from "../../utils/formatDateTime";

export default function CommentTree({
  comments,
  reload,
  authorId,
  replyTo,
  setReplyTo,
  singleReplyBox,
  setSingleReplyBox,
  level0ReplyBoxes,
  setLevel0ReplyBoxes,
}: {
  comments: CommentItem[];
  reload: () => void;
  authorId: number;
  replyTo: { [key: number]: string };
  setReplyTo: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  singleReplyBox: number | null;
  setSingleReplyBox: (id: number | null) => void;
  level0ReplyBoxes: number[];
  setLevel0ReplyBoxes: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean; }>({});
  const commentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [commentHeights, setCommentHeights] = useState<{ [key: number]: number; }>({});
  const [replyBoxHeights, setReplyBoxHeights] = useState<{ [key: number]: number; }>({});

  const countNestedReplies = (comment: CommentItem): number => {
    if (!comment.replies || comment.replies.length === 0) {
      return 0;
    }
    return comment.replies.reduce((acc, curr) => {
      return acc + 1 + countNestedReplies(curr);
    }, 0);
  };

  useEffect(() => {
    const newHeights: { [key: number]: number } = {};
    Object.entries(commentRefs.current).forEach(([id, el]) => {
      if (el) {
        newHeights[+id] = el.offsetHeight;
      }
    });

    setCommentHeights(newHeights);
  }, [comments, expandedComments, singleReplyBox, level0ReplyBoxes]);

  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);
  const location = useLocation();
  const blogId = location.state?.blogId || "";
  const { user } = useAuth();
  const API = process.env.REACT_APP_API_URL;

  const toggleReplies = (commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleComment = async (comment: CommentItem) => {
    const content = newComments[comment.id];
    if (!content) return;

    let backendReplyId = comment.id;
    let replyDisplayName = replyTo[comment.id];

    if (comment.level === 2 && comment.reply_to?.id) {
      backendReplyId = comment.reply_to.id;
    }

    try {
      await axios.post(`${API}/comment`, {
        status: "Approved",
        createdAt: new Date().toISOString(),
        user_id: user?.id,
        blog_id: blogId,
        reply_to: {
          id: backendReplyId,
          username: replyDisplayName,
        },
        content: content.replace(/\n/g, "<br/>"),
      });

      setNewComments((prev) => ({
        ...prev,
        [comment.id]: "",
      }));
      setReplyBoxHeights((prev) => ({
        ...prev,
        [comment.id]: 55,
      }));
      reload();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div>
      {comments.map((comment) => {
        const isReplyingHere =
          (comment.level === 0 && level0ReplyBoxes.includes(comment.id)) ||
          comment.id === singleReplyBox;
        const replyIndentLevel =
          comment.level && comment.level > 1
            ? comment.level
            : (comment.level || 0) + 1;
        return (
          <div key={comment.id} className="relative">
            <div className="w-full ">
              <div
                ref={(el: HTMLDivElement | null) => {
                  commentRefs.current[comment.id] = el;
                }}
                style={{
                  marginLeft: comment.reply_to
                    ? `${(comment.level || 0) * 40}px`
                    : undefined,
                }}
                className="flex items-start rounded-xl relative py-[10px] px-[24px]"
              >
                {(comment.replies!.length > 0 || isReplyingHere) && (
                  <div
                    className="absolute left-[40px] top-[48px] w-[2px] bg-[#e5e2e2]"
                    style={{
                      height: `${commentHeights[comment.id] - 43 || 0}px`,
                    }}
                  />
                )}

                {comment.level === 1 && (
                  <div
                    className="absolute left-[0px] top-[0px] w-[2px] bg-[#e5e2e2]"
                    style={{ height: `${commentHeights[comment.id] || 0}px` }}
                  />
                )}

                {comment.level === 2 && (
                  <>
                    <div
                      className="absolute left-[0px] top-[0px] w-[2px] bg-[#e5e2e2]"
                      style={{ height: `${commentHeights[comment.id] || 0}px` }}
                    />
                    <div
                      className="absolute left-[-40px] top-[0px] w-[2px] bg-[#e5e2e2]"
                      style={{ height: `${commentHeights[comment.id] || 0}px` }}
                    />
                  </>
                )}

                {comment.level !== 0 && (
                  <div
                    className="
                      absolute left-[0px] top-[10px] border-[2px] w-[24px] h-[20px]
                      border-r-0 border-t-0 border-b-[#e5e2e2] border-l-[#e5e2e2] border-r-[transparent] border-t-[transparent] rounded-bl-[8px]
                    "
                  />
                )}

                <img
                  src={comment.userInfor.avatar}
                  className="w-[35px] h-[35px] rounded-full relative z-[19]"
                  alt="avatar"
                />
                <div className="ml-2 flex-1">
                  <div className="bg-[#f0f2f5] rounded-xl px-[10px] py-2 shadow-sm">
                    <div className="font-semibold text-gray-800 flex gap-[12px] items-center">
                      {comment.userInfor.username}
                      {comment.user_id === authorId && (
                        <div className="text-[12px] text-[var(--text-color)] leading-[12px] flex items-center">
                          <i className="fa-solid fa-pen-fancy mr-[4px]"></i>
                          Author
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mt-1 break-all">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${comment.reply_to?.username
                            ? `<b class='mr-1'>${comment.reply_to.username}</b>`
                            : ""
                            }${comment.content}`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-[#65686C] mt-1 flex gap-4">
                    <span>
                      {comment.createdAt && formatDateTime(comment.createdAt)}
                    </span>
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        const targetId =
                          comment.level === 2 && comment.reply_to?.id
                            ? comment.reply_to.id
                            : comment.id;

                        setExpandedComments((prev) => ({
                          ...prev,
                          [targetId]: true,
                        }));

                        if (comment.level === 0) {
                          setLevel0ReplyBoxes((prev) =>
                            prev.includes(comment.id)
                              ? prev
                              : [...prev, comment.id]
                          );
                          setReplyTo((prev) => ({
                            ...prev,
                            [comment.id]: comment.userInfor.username,
                          }));
                        } else {
                          setSingleReplyBox(targetId);

                          setReplyTo((prev) => ({
                            ...prev,
                            [targetId]: comment.userInfor.username,
                          }));
                        }
                      }}
                    >
                      Trả lời
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nested replies */}
            {comment.replies && expandedComments[comment.id] && (
              <CommentTree
                comments={comment.replies}
                reload={reload}
                authorId={authorId}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                singleReplyBox={singleReplyBox}
                setSingleReplyBox={setSingleReplyBox}
                level0ReplyBoxes={level0ReplyBoxes}
                setLevel0ReplyBoxes={setLevel0ReplyBoxes}
              />
            )}

            {/* Reply textarea */}
            {isReplyingHere && (
              <div style={{ marginLeft: `${replyIndentLevel * 40}px` }}>
                <div className="relative flex w-full px-[24px]">
                  <div
                    className="
                      absolute left-[0] top-[0] border-[2px] w-[24px] h-[20px]
                      border-r-0 border-t-0 border-b-[#e5e2e2] border-l-[#e5e2e2] border-r-[transparent] border-t-[transparent] rounded-bl-[8px]
                    "
                  />
                  {comment.level !== 0 && (
                    <div
                      className="absolute left-[-40px] top-[0px] w-[2px] bg-[#e5e2e2]"
                      style={{
                        height: `${replyBoxHeights[comment.id] + 7 || 62}px`,
                      }}
                    />
                  )}
                  <img
                    src={user?.avatar}
                    className="w-[35px] h-[35px] rounded-full relative z-[19]"
                    alt="avatar"
                  />
                  <div className="ml-2 w-full">
                    <textarea
                      ref={replyInputRef}
                      value={newComments[comment.id] || ""}
                      placeholder={`Reply to ${replyTo[comment.id] || ""}`}
                      onChange={(e) => {
                        const { value } = e.target;
                        setNewComments((prev) => ({
                          ...prev,
                          [comment.id]: value,
                        }));

                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "55px";
                        target.style.height = `${target.scrollHeight}px`;

                        setReplyBoxHeights((prev) => ({
                          ...prev,
                          [comment.id]: target.scrollHeight,
                        }));
                      }}
                      className="text-[14px] w-full bg-[#f0f2f5] rounded-[18px] px-[8px] pt-[8px] pb-[26px] outline-none resize-none leading-[1.4] min-h-[55px]"
                      style={{ height: replyBoxHeights[comment.id] || 55 }}
                    />
                    <i
                      className={`fa-solid fa-paper-plane absolute right-[34px] bottom-[15px] ${newComments[comment.id]
                        ? "cursor-pointer text-[var(--active-color)]"
                        : "cursor-not-allowed text-[#bec3c9]"
                        }`}
                      onClick={() => handleComment(comment)}
                    ></i>
                  </div>
                </div>
              </div>
            )}

            {/* Show replies */}
            {comment.replies &&
              comment.replies.length > 0 &&
              !expandedComments[comment.id] && (
                <span
                  onClick={() => {
                    toggleReplies(comment.id);
                    setReplyTo((prev) => ({
                      ...prev,
                      [comment.id]: comment.userInfor.username,
                    }));
                    if (comment.level === 0) {
                      setLevel0ReplyBoxes((prev) =>
                        prev.includes(comment.id) ? prev : [...prev, comment.id]
                      );
                    } else {
                      setSingleReplyBox(comment.id);
                    }
                  }}
                  style={
                    {
                      marginLeft: `${(comment.level || 0) * 38 + 70}px`,
                    } as React.CSSProperties & {
                      [key: string]: string | undefined;
                    }
                  }
                  className="text-sm text-[#65686C] cursor-pointer hover:underline relative"
                >
                  {comment.level !== 0 ? (
                    <>
                      <div
                        className="absolute left-[-68px] top-[-4px] w-[2px] bg-[#e5e2e2]"
                        style={{ height: `26px` }}
                      />
                      <div
                        className="
                        absolute left-[-28px] top-[-8px] border-[2px] w-[24px] h-[20px]
                        border-r-0 border-t-0 border-b-[#e5e2e2] border-l-[#e5e2e2] border-r-[transparent] border-t-[transparent] rounded-bl-[8px]
                      "
                      />
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute left-[-30px] top-[-8px] w-[2px] bg-[#e5e2e2]"
                        style={{ height: `12px` }}
                      />
                      <div
                        className="
                        absolute left-[-30px] top-[-8px] border-[2px] border-b-[#e5e2e2] w-[24px] h-[20px]
                        border-r-0 border-t-0 border-b-[#e5e2e2] border-l-[#e5e2e2] border-r-[transparent] border-t-[transparent] rounded-bl-[8px]
                      "
                      />
                    </>
                  )}
                  {(() => {
                    const totalReplies = countNestedReplies(comment);
                    return (
                      <>
                        Show {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
                      </>
                    );
                  })()}

                </span>
              )}
          </div>
        );
      })}
    </div>
  );
}
