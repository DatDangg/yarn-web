import { CommentItem } from "../interfaces/blog";

export default function buildCommentTree(comments: CommentItem[]): CommentItem[] {
  const approved = comments.filter(c => c.status === "Approved");
  const map = new Map<number, CommentItem>();
  const roots: CommentItem[] = [];

  approved.forEach(c => {
    map.set(c.id, { ...c, replies: [], level: 0 });
  });

  map.forEach(comment => {
    if (comment.reply_to) {
      const parent = map.get(comment.reply_to.id);
      if (parent) {
        comment.level = (parent.level ?? 0) + 1;
        parent.replies!.push(comment);
      }
    } else {
      comment.level = 0;
      roots.push(comment);
    }
  });

  return roots;
}
