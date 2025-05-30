import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import { BlogDetailProps, CommentItem } from "../../interfaces/blog";


import buildCommentTree from "../../utils/buildCommentTree";

import CommentTree from "../../components/Comment/CommentTree";
import { useAuth } from "../../contexts/AuthContext";


function BlogDetail() {
  const location = useLocation();
  const blogId = location.state?.blogId || "";
  const API = process.env.REACT_APP_API_URL;
const [singleReplyBox, setSingleReplyBox] = useState<number | null>(null);
const [replyTo, setReplyTo] = useState<{ [key: number]: string }>({});
const [level0ReplyBoxes, setLevel0ReplyBoxes] = useState<number[]>([]);


  const [newComment, setNewComment] = useState('');
  const { user } = useAuth()
  const [data, setData] = useState<BlogDetailProps>();
  const [comments, setComments] = useState<CommentItem[]>([]);

  const fetchComment = async () => {
    try {
      await axios.get(`${API}/comment?blog_id=${blogId}`).then(async res => {
        let comments: CommentItem[] = res.data;

        const enrichedComments = await Promise.all(
          comments.map(async (comment) => {
            try {
              const userRes = await axios.get(`${API}/users/${comment.user_id}`);
              return {
                ...comment,
                userInfor: {
                  avatar: userRes.data.avatar,
                  username: userRes.data.username,
                },
              };
            } catch (err) {
              console.error(err);
              return {
                ...comment,
                userInfor: {
                  avatar: "",
                  username: "Unknown",
                },
              };
            }
          })
        );

        const tree = buildCommentTree(enrichedComments);
        console.log(tree)
        setComments(tree);
      });
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    axios.get(`${API}/blog/${blogId}`).then(res => {
      setData(res.data);
    });

    fetchComment()
  }, []);

  const handleComment = async () => {
    if (!newComment) return;

    try {
      await axios.post(`${API}/comment`, {
        status: "Approved",
        createdAt: new Date().toISOString(),
        user_id: user?.id,
        blog_id: blogId,
        content: newComment.replace(/\n/g, '<br/>')
      });

      setNewComment('');
      fetchComment();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };


  return (
    <div className="mt-[150px] mb-[36px]">
      <div className="container">
        <div className="text-[32px] text-center font-[600] uppercase font-[family-name:var(--font-IMFell)]">
          {data?.title}
        </div>
        <div
          className={`
            relative text-center text-[var(--text-color)] text-[20px] font-[family-name:var(--font-Gentium)] mt-[12px]
            before:content-[''] before:absolute before:top-[50%] before:w-[24px] before:h-[1px] before:border-[1px] before:border-[var(--border-color)] before:ml-[-41px] before:right
            after:content-[''] after:absolute after:top-[50%] after:w-[24px] after:h-[1px] after:border-[1px] after:border-[var(--border-color)] after:ml-[15px]
          `}
        >
          {data && (data.updatedAt ? formatDate(data.updatedAt) : formatDate(data.createdAt))}
        </div>
        <div className="relative pt-[24px] py-[24px]">
          <img className="absolute" src="/line.png" alt="" />
          <img className="absolute" src="/line1.png" alt="" />
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data?.content || "" }}
        />

        <div className={`
          relative text-center text-[var(--text-color)] text-[20px] font-[family-name:var(--font-Gentium)] mt-[12px]
          before:content-[''] before:absolute before:top-[50%] before:w-[40%] before:h-[1px] before:border-[1px] before:border-[var(--border-color)] before:left-0
          after:content-[''] after:absolute after:top-[50%] after:w-[40%] after:h-[1px] after:border-[1px] after:border-[var(--border-color)] after:right-0
        `}>
          Comments
        </div>
        <div className="relative flex w-full px-[24px] py-[10px] mb-[12px]">
          <img
            src={user?.avatar}
            className="w-[35px] h-[35px] rounded-full relative z-[19]"
            alt="avatar"
          />
          <div className="ml-2 w-full">
            <textarea
              value={newComment}
              placeholder={`Write your comment`}
              onChange={(e) => {
                setNewComment(e.target.value);
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '55px';
                target.style.height = `${target.scrollHeight}px`;
              }}
              className="text-[14px] w-full bg-[#f0f2f5] rounded-[18px] px-[8px] pt-[8px] pb-[26px] outline-none resize-none leading-[1.4] min-h-[55px]"
              style={{ height: '55px' }}
            />
            <i
              className={`fa-solid fa-paper-plane absolute right-[34px] bottom-[25px] ${newComment
                ? 'cursor-pointer text-[var(--active-color)]'
                : 'cursor-not-allowed text-[#bec3c9]'
                }`}
              onClick={() => handleComment()}
            ></i>
          </div>
        </div>
<CommentTree
  comments={comments}
  reload={fetchComment}
  authorId={data?.author_id || 0}
  singleReplyBox={singleReplyBox}
  setSingleReplyBox={setSingleReplyBox}
  replyTo={replyTo}
  setReplyTo={setReplyTo}
  level0ReplyBoxes={level0ReplyBoxes}
  setLevel0ReplyBoxes={setLevel0ReplyBoxes}
/>


      </div>
    </div>
  );
}

export default BlogDetail;
