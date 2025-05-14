import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUpdateProfile from "../hooks/mutations/useUpdateProfile";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout, userInfo, updateUserInfo } = useAuth();
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const { mutateAsync: updateUserProfile, isPending } = useUpdateProfile();

  // userInfo가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    console.log("마이페이지 userInfo 변경:", userInfo);
    if (userInfo) {
      setName(userInfo.name);
      setBio(userInfo.bio || "");
    }
  }, [userInfo]);

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
      console.log("프로필 업데이트 시작");
      const response = await updateUserProfile({
        name,
        bio: bio || "",
        profileImage: profileImage || null,
      });

      console.log("서버 응답:", response);

      if (response.status && response.statusCode === 200) {
        // 서버 응답 데이터가 실제로 변경되었는지 확인
        if (response.data.name !== name || response.data.bio !== bio) {
          console.error("서버 응답 데이터가 요청한 데이터와 일치하지 않습니다.");
          alert("프로필 업데이트가 제대로 반영되지 않았습니다. 다시 시도해주세요.");
          return;
        }

        console.log("프로필 업데이트 성공, 새로운 데이터:", response.data);
        updateUserInfo(response.data);
        setProfileImage(null);
        alert("프로필이 업데이트되었습니다.");
      } else {
        console.error("프로필 업데이트 실패:", response);
        alert("프로필 업데이트 실패.");
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  if (!userInfo) {
    return <div className="mt-20">로딩 중...</div>;
  }

  return (
    <div className="mt-20">
      <h1>{userInfo.name} 님, 환영합니다.</h1>
      <h1>{userInfo.email}</h1>

      <form onSubmit={handleProfileUpdate} className="space-y-4 mt-5">
        <div>
          <label className="block">이름</label>
          <input
            type="text"
            className="p-2 border text-black w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          disabled={isPending}
        >
          {isPending ? "업데이트 중..." : "프로필 업데이트"}
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
