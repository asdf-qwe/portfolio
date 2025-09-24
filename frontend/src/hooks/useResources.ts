import { useState, useEffect, useCallback } from "react";
import {
  getFilesByCategory,
  deleteFile,
  FileResource,
} from "@/features/upload/service/uploadService";

export const useResources = (categoryId: string) => {
  const [resources, setResources] = useState<FileResource[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);

  const loadResources = useCallback(async () => {
    try {
      setIsResourcesLoading(true);
      const resourcesFromApi = await getFilesByCategory(parseInt(categoryId));
      setResources(resourcesFromApi);
    } catch (error) {
      console.error("자료 로딩 실패:", error);
      setResources([]);
    } finally {
      setIsResourcesLoading(false);
    }
  }, [categoryId]);

  const handleUploadSuccess = async () => {
    setResources([]);
    setIsResourcesLoading(true);
    await loadResources();
  };

  const handleDeleteResource = async (id: string) => {
    const confirmDelete = window.confirm(
      "정말로 이 자료를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      await deleteFile(parseInt(id));
      const updatedResources = resources.filter(
        (resource) => resource.id !== id
      );
      setResources(updatedResources);
    } catch (error) {
      console.error("자료 삭제 실패:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (categoryId) {
      loadResources();
    }
  }, [categoryId, loadResources]);

  return {
    resources,
    isResourcesLoading,
    loadResources,
    handleUploadSuccess,
    handleDeleteResource,
  };
};
