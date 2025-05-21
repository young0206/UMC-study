import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUpdateProfile from "../hooks/mutations/useUpdateProfile";
import { axiosInstance } from "../apis/axios";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout, userInfo, updateUserInfo } = useAuth();
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("이미지 업로드 요청 시작");
      const response = await axiosInstance.post("/v1/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("이미지 업로드 응답:", response.data);

      if (response.data.status && (response.data.statusCode === 200 || response.data.statusCode === 201)) {
        const imageUrl = response.data.data.imageUrl;
        if (!imageUrl) {
          throw new Error("이미지 URL이 없습니다.");
        }
        return imageUrl;
      }
      throw new Error(response.data.message || "이미지 업로드 실패");
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      throw error;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) {
      alert("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    if (name.trim() === "") {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      console.log("프로필 업데이트 시작");
      let avatarUrl = userInfo.avatar;

      // 새 이미지가 있는 경우 먼저 업로드
      if (profileImage) {
        try {
          console.log("이미지 업로드 시작");
          avatarUrl = await uploadImage(profileImage);
          console.log("이미지 업로드 완료, URL:", avatarUrl);
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          alert("이미지 업로드에 실패했습니다. 프로필 정보만 업데이트됩니다.");
        }
      }

      console.log("프로필 업데이트 요청 시작");
      const response = await updateUserProfile({
        name,
        bio: bio || "",
        profileImage: null,
        avatar: avatarUrl,
      });

      console.log("서버 응답:", response);

      if (response.status && response.statusCode === 200) {
        console.log("프로필 업데이트 성공, 새로운 데이터:", response.data);
        // userInfo 업데이트
        const updatedUserInfo = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          bio: response.data.bio,
          avatar: avatarUrl,
        };
        console.log("업데이트할 사용자 정보:", updatedUserInfo);
        updateUserInfo(updatedUserInfo);
        setProfileImage(null);
        setIsEditing(false);
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
      <div className="flex flex-col items-center mb-8">
        {userInfo.avatar ? (
          <img
            src={userInfo.avatar}
            alt="프로필 이미지"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
        <h1 className="text-xl font-bold">{userInfo.name} 님, 환영합니다.</h1>
        <p className="text-gray-600">{userInfo.email}</p>
        {userInfo.bio && <p className="mt-2 text-gray-700">{userInfo.bio}</p>}
      </div>

      {!isEditing ? (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white text-black px-4 py-2 rounded whitespace-nowrap border border-black hover:bg-gray-50"
          >
            프로필 수정하기
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded whitespace-nowrap border border-black hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-4 mt-5 max-w-md mx-auto">
          <div>
            <label className="block mb-2">이름</label>
            <input
              type="text"
              className="p-2 border text-black w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요."
            />
          </div>

          <div>
            <label className="block mb-2">자기소개</label>
            <textarea
              className="p-2 border text-black w-full rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해 주세요."
            />
          </div>

          <div>
            <label className="block mb-2">프로필 사진</label>
            <input
              type="file"
              className="p-2 border text-black w-full rounded"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-gray-50"
              disabled={isPending}
            >
              {isPending ? "업데이트 중..." : "저장하기"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(userInfo.name);
                setBio(userInfo.bio || "");
                setProfileImage(null);
              }}
              className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Mypage;
