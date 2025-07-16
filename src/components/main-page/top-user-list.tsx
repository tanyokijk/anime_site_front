import React from "react";
import CardCollection from "./card-collection";

interface User {
  id: string;
  avatar: string;
  name: string;
  created_at: string;
  comments_count: number;
  achievements_count: number;
  rank: number;
}

interface TopUserListProps {
  users: User[];
}

const TopUserList: React.FC<TopUserListProps> = ({ users }) => {
  return (
    <div className="flex flex-col gap-0">
      <CardCollection
        title="Топ користувачі"
        items={users}
        cardType="top-user"
      />
    </div>
  );
};

export default TopUserList;
