// 파일이 이미지인지 확인하는 함수
export const isImageFile = (fileName: string | null | undefined) => {
  if (!fileName || typeof fileName !== "string") return false;
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ];
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return false;
  const extension = fileName.toLowerCase().substring(lastDotIndex);
  return imageExtensions.includes(extension);
};

// URL을 자동으로 링크로 변환하는 함수
export const autoLinkUrls = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `[${url}](${url})`);
};

// 파일 크기 포맷팅 함수
export const formatFileSize = (bytes: number | undefined | null) => {
  if (!bytes || bytes === 0 || isNaN(bytes)) return "알 수 없음";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 날짜 포맷팅 함수
export const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return "알 수 없음";
  try {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "알 수 없음";
  }
};
