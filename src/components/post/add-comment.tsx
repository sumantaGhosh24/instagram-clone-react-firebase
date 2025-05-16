import {useState, FormEvent} from "react";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";

import {useFirebase} from "../../firebase/auth-context";
import {db} from "../../firebase/firebase";

interface AddCommentProps {
  docId: string;
  comments: string[];
  setComments: any;
  commentInput: any;
}

export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
}: AddCommentProps) {
  const [comment, setComment] = useState("");

  const {authUser} = useFirebase();

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();

    setComments([...comments, {displayName: authUser?.displayName, comment}]);
    setComment("");

    return updateDoc(doc(db, "posts", docId), {
      comments: arrayUnion({displayName: authUser?.username, comment}),
    });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-500 w-full mr-3 py-5 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({target}) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-500 cursor-pointer ${
            !comment && "opacity-25"
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}
