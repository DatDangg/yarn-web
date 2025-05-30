import { useState } from "react";
import { CommentItem } from "../../interfaces/blog";
import CommentTree from "./CommentTree";

export default function CommentSection({
  comments,
  reload,
  authorId,
}: {
  comments: CommentItem[];
  reload: () => void;
  authorId: number;
}) {
  const [replyTo, setReplyTo] = useState<{ [key: number]: string }>({});
  const [singleReplyBox, setSingleReplyBox] = useState<number | null>(null); // for level 1 & 2
  const [level0ReplyBoxes, setLevel0ReplyBoxes] = useState<number[]>([]);    // multiple allowed

  return (
    <CommentTree
      comments={comments}
      reload={reload}
      authorId={authorId}
      replyTo={replyTo}
      setReplyTo={setReplyTo}
      singleReplyBox={singleReplyBox}
      setSingleReplyBox={setSingleReplyBox}
      level0ReplyBoxes={level0ReplyBoxes}
      setLevel0ReplyBoxes={setLevel0ReplyBoxes}
    />
  );
}
