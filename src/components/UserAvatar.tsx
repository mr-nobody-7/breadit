import { Avatar, AvatarFallback } from "./ui/Avatar";
import { User } from "next-auth";
import { FC } from "react";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "./Icons";

interface UserAvatarProps extends AvatarProps{
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square w-full h-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span>{user?.name}</span>
          <Icons.user className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
