import React from "react";
import CardCollection from "./card-collection";
import CommentCard from "./CommentSection/comment-card";

interface Comment {
  user_name: string;
  user_avatar: string;
  created_at: string;
  text?: string;
  title: string;
  url:string;
  type:string;
}

interface CommentCollectionProps {
  comments: Comment[];
}

const CommentCollection: React.FC<CommentCollectionProps> = ({ comments }) => {
  return (
    <CardCollection
      title="Останні коментарі"
      items={comments}
      cardType="comment"
    />
  );
};

export default CommentCollection;
