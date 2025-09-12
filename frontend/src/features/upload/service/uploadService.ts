// 파일 업로드 서비스
export const uploadFileToS3 = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    // 백엔드에서 presigned URL을 문자열로 반환
    const presignedUrl = await response.text();
    return presignedUrl;
  } catch (error) {
    console.error("파일 업로드 오류:", error);
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
