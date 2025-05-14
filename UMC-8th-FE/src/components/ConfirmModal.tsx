interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="fixed z-30  bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4 text-black">정말로 계정을 삭제하시겠습니까?</h2>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
