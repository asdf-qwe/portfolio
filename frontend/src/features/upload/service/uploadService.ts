// 파일 업로드 서비스

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 파일 리소스 인터페이스
export interface FileResource {
  id: string;
  name: string;
  title?: string;
  url: string;
  uploadDate: string;
  size: number;
}

// ✅ 일반 자료 업로드 (categoryId 필요)
export const uploadFileToS3 = async (
  file: File,
  categoryId: number,
  title?: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", categoryId.toString());
    if (title) {
      formData.append("title", title);
    }

    // AbortController로 타임아웃 설정 (3분)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3분

    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`업로드 실패 (${response.status}): ${errorText}`);
    }

    // 백엔드에서 업로드된 파일 URL을 문자열로 반환
    const fileUrl = await response.text();
    return fileUrl;
  } catch (error) {
    console.error("파일 업로드 오류:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "업로드 시간이 초과되었습니다. 파일 크기를 확인해주세요."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요."
        );
      }
    }

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

    const response = await fetch(
      `${API_BASE_URL}/api/files/upload/profile-image`,
      {
        method: "POST",
        body: formData,
      }
    );

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
    // 파일 크기 체크 (100MB)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("파일 크기는 100MB 이하여야 합니다.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", categoryId.toString());

    // AbortController로 타임아웃 설정 (5분)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5분

    const response = await fetch(
      `${API_BASE_URL}/api/files/upload/main-video`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`업로드 실패 (${response.status}): ${errorText}`);
    }

    const videoUrl = await response.text();
    return videoUrl;
  } catch (error) {
    console.error("대표 동영상 업로드 오류:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "업로드 시간이 초과되었습니다. 파일 크기를 확인해주세요."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요."
        );
      }
    }

    throw error;
  }
};

// ✅ 카테고리별 파일 조회
export const getFilesByCategory = async (
  categoryId: number
): Promise<FileResource[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/files/category/${categoryId}`,
      {
        method: "GET",
        credentials: "omit",
      }
    );

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
    const response = await fetch(
      `${API_BASE_URL}/api/files/user/${userId}/profile-image`,
      {
        method: "GET",
        credentials: "omit",
      }
    );

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
      `${API_BASE_URL}/api/files/category/${categoryId}/main-video`,
      {
        method: "GET",
        credentials: "omit",
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

// 파일 타입 체크 (확장자 기반)
export const validateFileType = (
  file: File,
  allowedTypes: string[] = []
): boolean => {
  if (allowedTypes.length === 0) return true;

  // 파일 이름에서 확장자 추출
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));

  // 허용된 확장자와 비교
  return allowedTypes.some((type) => type.toLowerCase() === fileExtension);
};

// 파일 이름 정리
export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
};
