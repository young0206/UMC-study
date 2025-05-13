import CommentsSkeleton from "./CommentsSkeleton";


interface CommentsSkeletonListProps {
    count: number;
}

const CommentsSkeletionList = ({count}: CommentsSkeletonListProps) => {
  return (
    <>
        {new Array(count).fill(0).map((_, idx) => (
            <CommentsSkeleton key={idx} />
        ))}
    </>
  )
}

export default CommentsSkeletionList
