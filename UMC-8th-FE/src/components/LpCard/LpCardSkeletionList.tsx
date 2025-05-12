import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardSkeletonListProps {
    count: number;
}

const LpCardSkeletionList = ({count}: LpCardSkeletonListProps) => {
  return (
    <>
        {new Array(count).fill(0).map((_, idx) => (
            <LpCardSkeleton key={idx} />
        ))}
    </>
  )
}

export default LpCardSkeletionList
