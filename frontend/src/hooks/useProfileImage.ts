import { useState, useEffect } from "react";
import {
  uploadProfileImage,
  getUserProfileImage,
} from "@/features/upload/service/uploadService";
import { MAIN_PAGE_CONSTANTS } from "@/constants/mainPageConstants";

export const useProfileImage = (userId: string, canEdit: boolean) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    MAIN_PAGE_CONSTANTS.IMAGES.DEFAULT_PROFILE
  );
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(true);

  // 프로필 이미지 가져오기
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setProfileImageLoading(true);
        const imageUrl = await getUserProfileImage(parseInt(userId));
        if (imageUrl) {
          setProfileImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("프로필 이미지 조회 실패:", error);
        // 에러 시 기본 이미지 유지
      } finally {
        setProfileImageLoading(false);
      }
    };

    fetchProfileImage();
  }, [userId]);

  // 프로필 이미지 업로드 처리
  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      setIsUploadingProfile(true);
      const imageUrl = await uploadProfileImage(file, parseInt(userId));
      setProfileImageUrl(imageUrl);
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  return {
    profileImageUrl,
    isUploadingProfile,
    profileImageLoading,
    handleProfileImageUpload,
  };
};
