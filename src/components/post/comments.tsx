import {useState} from "react";
import {formatDistance} from "date-fns";
import {Link} from "react-router-dom";

import AddComment from "./add-comment";

interface CommentsProps {
  docId: string;
  comments: string[];
  posted: number;
  commentInput: any;
}

export default function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
}: CommentsProps) {
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item: any) => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link to={`/p/${item.displayName}`}>
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-500 mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                showNextComments();
              }
            }}
          >
            View more comments
          </button>
        )}
        <p className="text-gray-500 font-medium text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}
