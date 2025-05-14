import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUpdateProfile from "../hooks/mutations/useUpdateProfile";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>(""); // bio가 null일 수 있으므로 기본값을 빈 문자열로 설정
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Mutation 훅을 사용하여 프로필 업데이트
  const { mutateAsync: updateUserProfile, isLoading } = useUpdateProfile();

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      setData(response);
      setName(response?.data.name || ""); // 기존 이름 불러오기
      setBio(response?.data.bio || ""); // 기존 bio 불러오기, null이면 빈 문자열로 설정
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() === "") {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      // mutateAsync 사용하여 Promise 반환값 받기
      const response = await updateUserProfile({
        name,
        bio: bio || "",
        profileImage: profileImage || null,
      });

      console.log("Response:", response); // 응답 로그 확인
      if (response?.success) {
        alert("프로필이 업데이트되었습니다.");
      } else {
        alert("프로필 업데이트 실패.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-20">
      <h1>{data?.data.name} 님, 환영합니다.</h1>
      <h1>{data?.data.email}</h1>

      <form onSubmit={handleProfileUpdate} className="space-y-4 mt-5">
        <div>
          <label className="block">이름</label>
          <input
            type="text"
            className="p-2 border text-black w-full"
            value={name} // name 상태와 연결
            onChange={(e) => setName(e.target.value)} // 이름 변경 시 상태 업데이트
            placeholder="이름을 입력해 주세요."
          />
        </div>

        <div>
          <label className="block">자기소개</label>
          <textarea
            className="p-2 border text-black w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력해 주세요."
          />
        </div>

        <div>
          <label className="block">프로필 사진</label>
          <input
            type="file"
            className="p-2 border text-black"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          disabled={isLoading}
        >
          {isLoading ? "업데이트 중..." : "프로필 업데이트"}
        </button>
      </form>

      <button
        className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90 mt-4"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Mypage;
