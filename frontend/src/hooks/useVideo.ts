import { useState, useEffect } from "react";
import {
  uploadMainVideo,
  getMainVideoByCategory,
} from "@/features/upload/service/uploadService";
import { CONSTANTS } from "@/utils/constants";
import { CategoryResponse } from "@/features/category/types/category";

export const useVideo = (category: CategoryResponse | null) => {
  const [mainVideoUrl, setMainVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    const loadMainVideo = async () => {
      if (!category) return;

      try {
        setIsVideoLoading(true);
        const videoUrl = await getMainVideoByCategory(category.id);
        if (videoUrl) {
          setMainVideoUrl(videoUrl);
        }
      } catch (error) {
        console.error("대표 동영상 조회 실패:", error);
      } finally {
        setIsVideoLoading(false);
      }
    };

    if (category) {
      loadMainVideo();
    }
  }, [category]);

  const handleMainVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!category) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("동영상 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > CONSTANTS.MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      alert(
        `파일 크기는 ${CONSTANTS.MAX_VIDEO_SIZE_MB}MB를 초과할 수 없습니다.`
      );
      return;
    }

    try {
      setIsUploadingVideo(true);
      const videoUrl = await uploadMainVideo(file, category.id);
      setMainVideoUrl(videoUrl);
    } catch (error) {
      console.error("동영상 업로드 실패:", error);
      alert("동영상 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploadingVideo(false);
      event.target.value = "";
    }
  };

  return {
    mainVideoUrl,
    isVideoLoading,
    isUploadingVideo,
    handleMainVideoUpload,
  };
};
