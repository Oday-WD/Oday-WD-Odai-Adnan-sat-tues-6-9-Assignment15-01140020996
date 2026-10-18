import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import { getSinglePost } from "../../service/Post.service";
import toast from "react-hot-toast";
import { PostCard } from "../../components/posts/components/PostCard";
import { Loader } from "../../components/Shared/Loader/Loader";
import { useParams } from "react-router-dom";
import { BackButton } from "../../components/Shared/BackButton/BackButton";
export const PostDetails = () => {
   const {postId} = useParams()
  const { token } = useAuth();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["singlePosts", postId],
    queryFn: () => getSinglePost(token, postId!),
  });

  if (isLoading) return <Loader />;

  if (isError) {
    toast.error(error?.message ?? "Something wrong");
    return null;
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-3xl space-y-4">
            <BackButton/>
            {data && data.data.data.post && (
              <PostCard post={data.data.data.post} variant={"details"} />
            )}
          </div>
        </main>
      </div>
    </>
  );
};
