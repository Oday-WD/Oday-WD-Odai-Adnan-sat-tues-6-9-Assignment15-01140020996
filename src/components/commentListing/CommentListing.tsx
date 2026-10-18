import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../../service/comment.service";
import { useAuth } from "../../context/AuthProvider";
import { type Comment } from "./../../interfaces/comment";
import { CommentItem } from "./CommentItem";

interface CommentListingProps {
  postId: string;
}
export const CommentListing = ({ postId }: CommentListingProps) => {
  const { token } = useAuth();
  const { data } = useQuery({
    queryKey: ["PostComments", postId],
    queryFn: () => getPostComments(token, postId),
  });

  return (
    <>
      {data &&
        data.data.data.comments.map((comment: Comment) => (
          <CommentItem key={comment._id} comment={comment} postId={postId} />
        ))}
    </>
  );
};