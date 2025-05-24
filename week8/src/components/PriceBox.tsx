import { useCartActions, useCartInfo } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const PriceBox = () => {
  const { clearCart, calculateTotals } = useCartActions();
  const { total } = useCartInfo();
  const { isOpen, modalOpen, modalClose } = useModalStore();

  const handleOpen = () => {
    modalOpen();
  };

  const handleConfirm = () => {
    clearCart();
    calculateTotals();
    modalClose();
  };

  const handleCancel = () => {
    modalClose();
  };

  return (
    <div className="p-12">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleOpen}
          className="border p-4 rounded-md cursor-pointer"
        >
          장바구니 초기화
        </button>
        <div>총 가격: {total}원</div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center cursor-pointer">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="mb-4">정말 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                아니요
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceBox;
