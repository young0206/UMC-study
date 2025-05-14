import { useState } from "react";
import axios from "axios";

interface LpMakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LpMakeModal = ({ isOpen, onClose }: LpMakeModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = () => {
    if (thumbnail) {
      const formData = new FormData();
      formData.append("file", thumbnail);
      axios
        .post("/upload-endpoint", formData)
        .then((response) => {
          console.log("이미지 업로드 성공:", response);
        })
        .catch((error) => {
          console.error("이미지 업로드 실패:", error);
        });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
        <button className="absolute top-3 right-3 text-xl" onClick={onClose}>
          ×
        </button>

        {/* 이미지 업로드 */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 mb-3 rounded"
          />
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-30 h-30 rounded-full"
              />
            </div>
          )}
        </div>

        {/* 제목, 내용 */}
        <input
          type="text"
          placeholder="LP Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          placeholder="LP Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        {/* 태그 입력 및 추가 */}
        <div className="mb-3">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={handleAddTag}
              className="bg-gray-900 text-white px-3 rounded"
            >
              Add
            </button>
          </div>

          {/* 태그 리스트 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-gray-200 px-2 py-1 rounded"
              >
                <span className="mr-2">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={() => {
            console.log({ title, content, tags, thumbnail });
            handleSubmit();
          }}
          className="w-full py-2 bg-gray-900 text-white rounded"
        >
          Add LP
        </button>
      </div>
    </div>
  );
};

export default LpMakeModal;
