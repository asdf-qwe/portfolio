// 파일 업로드 서비스

// ✅ 일반 자료 업로드 (categoryId 필요)
export const uploadFileToS3 = async (
  file: File,
  categoryId: number
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", categoryId.toString());

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    // 백엔드에서 업로드된 파일 URL을 문자열로 반환
    const fileUrl = await response.text();
    return fileUrl;
  } catch (error) {
    console.error("파일 업로드 오류:", error);
    throw error;
  }
};

// ✅ 유저 프로필 이미지 업로드
export const uploadProfileImage = async (
  file: File,
  userId: number
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());

    const response = await fetch("/api/files/upload/profile-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("프로필 이미지 업로드에 실패했습니다.");
    }

    const imageUrl = await response.text();
    return imageUrl;
  } catch (error) {
    console.error("프로필 이미지 업로드 오류:", error);
    throw error;
  }
};

// ✅ 카테고리 대표 동영상 업로드
export const uploadMainVideo = async (
  file: File,
  categoryId: number
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", categoryId.toString());

    const response = await fetch("/api/files/upload/main-video", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("대표 동영상 업로드에 실패했습니다.");
    }

    const videoUrl = await response.text();
    return videoUrl;
  } catch (error) {
    console.error("대표 동영상 업로드 오류:", error);
    throw error;
  }
};

// ✅ 카테고리별 파일 조회
export const getFilesByCategory = async (
  categoryId: number
): Promise<string[]> => {
  try {
    const response = await fetch(`/api/files/category/${categoryId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("파일 목록 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("파일 목록 조회 오류:", error);
    throw error;
  }
};

// ✅ 유저 프로필 이미지 조회
export const getUserProfileImage = async (userId: number): Promise<string> => {
  try {
    const response = await fetch(`/api/files/user/${userId}/profile-image`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("프로필 이미지 조회에 실패했습니다.");
    }

    return await response.text();
  } catch (error) {
    console.error("프로필 이미지 조회 오류:", error);
    throw error;
  }
};

// ✅ 카테고리 대표 동영상 조회
export const getMainVideoByCategory = async (
  categoryId: number
): Promise<string> => {
  try {
    const response = await fetch(
      `/api/files/category/${categoryId}/main-video`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("대표 동영상 조회에 실패했습니다.");
    }

    return await response.text();
  } catch (error) {
    console.error("대표 동영상 조회 오류:", error);
    throw error;
  }
};

// 파일 크기 제한 체크
export const validateFileSize = (
  file: File,
  maxSizeMB: number = 10
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// 파일 타입 체크
export const validateFileType = (
  file: File,
  allowedTypes: string[] = []
): boolean => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.some((type) => file.type.includes(type));
};

// 파일 이름 정리
export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
};
