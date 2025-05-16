import {Link} from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import {DEFAULT_IMAGE_PATH} from "../../constants/paths";

interface UserProps {
  username: string;
  fullName: string;
  imageUrl?: string;
}

export default function User({username, fullName, imageUrl}: UserProps) {
  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <Link to={`/p/${username}`} className="flex items-center gap-3 mb-5">
      <img
        className="rounded-full w-12 h-12 flex object-cover"
        src={imageUrl ?? "/images/avatars/default.jpg"}
        alt=""
        onError={(e: any) => {
          e.target.src = DEFAULT_IMAGE_PATH;
        }}
      />
      <div>
        <p className="font-bold text-xl">{username}</p>
        <p className="text-sm">{fullName}</p>
      </div>
    </Link>
  );
}
