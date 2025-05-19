import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletionList from "../components/LpCard/LpCardSkeletionList";
import useGetInfiniteLpList from "../hooks/queries/LpList/useGetInfiniteLpList";
import LpMakeModal from "../components/LpMakeModal";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, debouncedValue, order);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    if (lps?.pages) {
      lps.pages.forEach((page, index) => {
        console.log(`📦 page ${index} data:`, page?.data?.data);
      });
    }
  }, [lps]);

  if (isPending) {
    return <div className="mt-20">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-20">Error</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <input
        className="mb-4 p-2 border"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
      />

      <button
        onClick={() => setIsOpen(true)}
        className="z-50 bg-gray-900 w-18 h-18 font-bold text-4xl rounded-full flex items-center justify-center text-white fixed bottom-18 right-5"
      >
        +
      </button>
      <LpMakeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="mb-4 flex gap-2 justify-end">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 border rounded ${
            order === PAGINATION_ORDER.desc ? "bg-gray-900 text-white" : ""
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 border rounded ${
            order === PAGINATION_ORDER.asc ? "bg-gray-900 text-white" : ""
          }`}
        >
          오래된순
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}

        {isFetching && <LpCardSkeletionList count={20} />}
      </div>

      <div ref={ref} className="h-2" />
    </div>
  );
};

export default HomePage;
