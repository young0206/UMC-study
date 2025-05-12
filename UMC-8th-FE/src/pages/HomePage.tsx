import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletionList from "../components/LpCard/LpCardSkeletionList";

const HomePage = () => {
  const [search, setSearch] = useState("");
  // const {data, isPending, isError} = useGetLpList({
  //   search,
  //   limit: 20,
  // });

  const {
    data:lps, 
    isFetching, 
    hasNextPage, 
    isPending, 
    fetchNextPage, 
    isError
  } = useGetInfiniteLpList(1, search, PAGINATION_ORDER.desc)

  // ref, inVew
  // ref -> 특정한 HTML 요소를 감시할 수 있다
  // inView -> 그 요소가 화면에 보이면 true
  const {ref, inView} = useInView({threshold: 0})

  useEffect(() => {
    if(inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

if (isPending) {
  return <div className={"mt-20"}>Loading...</div>
}

if (isError) {
  return <div className={"mt-20"}>Error</div>
}

  return (
  <div className="container mx-auto px-4 py-6">
    <input value={search} onChange={(e) => setSearch(e.target.value)} />
    <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
    {lps?.pages?.map((page) => page.data.data)
    ?.flat()
    ?.map((lp) => (
      <LpCard key={lp.id} lp={lp}/>
    ))}
    {isFetching && <LpCardSkeletionList count={20} />}
    </div>
    <div ref={ref} className="h-2"></div>
  </div>)
};

export default HomePage;
