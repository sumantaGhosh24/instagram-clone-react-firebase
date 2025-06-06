import Skeleton from "react-loading-skeleton";

interface PostsProps {
  posts: any[];
}

export default function Posts({posts}: PostsProps) {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-3 gap-8 mt-4 mb-12">
        {!posts
          ? new Array(12)
              .fill(0)
              .map((_, i) => <Skeleton key={i} width={320} height={400} />)
          : posts.length > 0
          ? posts.map((post) => (
              <div key={post.docId} className="relative group">
                <img
                  src={post.imageSrc}
                  alt={post.caption}
                  className="h-[200px] w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 z-10 w-full justify-evenly items-center h-full bg-black/50 group-hover:flex hidden">
                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.likes.length}
                  </p>

                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.comments.length}
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>

      {!posts ||
        (posts.length === 0 && (
          <p className="text-center text-2xl">No Posts Yet</p>
        ))}
    </div>
  );
}
