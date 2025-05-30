export interface BlogProps {
  id: number;
  title: string;
  image: string;
  category: string;
}

export interface BlogCardProps {
  id: number,
  title: string,
  image: string,
  category: string
}

export interface BlogDetailProps {
  id: number;
  content: string;
  title: string;
  image: string;
  category: string;
  author_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentItem {
  id: number;
  content: string;
  status: string;
  user_id: number;
  userInfor: { avatar: string, username: string };
  reply_to?: {
    id: number;  //comment_id
    username: string; //username
  };
  createdAt?: string;
  replies?: CommentItem[];
  level?: number,
  placeholder?: string,
}

