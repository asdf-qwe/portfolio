"use client";

import { useState, useEffect, useCallback } from "react";
import FileUpload from "@/features/upload/components/FileUpload";
import {
  getFilesByCategory,
  FileResource,
} from "@/features/upload/service/uploadService";

interface ResourceManagerProps {
  categoryId: number; // ✅ categoryId로 변경하고 number 타입으로 수정
  className?: string;
}

export default function ResourceManager({
  categoryId, // ✅ categoryId로 변경
  className = "",
}: ResourceManagerProps) {
  const [resources, setResources] = useState<FileResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `resources_${categoryId}`; // ✅ categoryId 사용

  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true);
      // ✅ 백엔드 API에서 파일 목록 가져오기
      const resourcesFromApi = await getFilesByCategory(categoryId);

      // 기존 localStorage 데이터와 병합 (임시 호환성)
      const savedResources = localStorage.getItem(storageKey);
      const localResources = savedResources ? JSON.parse(savedResources) : [];

      setResources([...resourcesFromApi, ...localResources]);
    } catch (error) {
      console.error("자료 로딩 실패:", error);
      // 에러 발생 시 localStorage 데이터만 사용
      const savedResources = localStorage.getItem(storageKey);
      if (savedResources) {
        setResources(JSON.parse(savedResources));
      }
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, storageKey]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleUploadSuccess = async (url: string, fileName: string) => {
    const newResource: FileResource = {
      id: `new_${Date.now()}`,
      name: fileName,
      title: fileName, // ✅ title 추가
      url: url,
      uploadDate: new Date().toISOString(),
      size: 0, // 실제로는 백엔드에서 파일 크기 정보를 받아와야 함
    };

    // 새 파일을 목록에 즉시 추가
    setResources((prev) => [newResource, ...prev]);

    // 선택적으로 전체 목록을 다시 로드하여 서버와 동기화
    setTimeout(() => {
      loadResources();
    }, 1000);
  };

  const handleDelete = (id: string) => {
    const updatedResources = resources.filter((resource) => resource.id !== id);
    setResources(updatedResources);
    localStorage.setItem(storageKey, JSON.stringify(updatedResources));
  };

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return "알 수 없음";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string | undefined | null) => {
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

  return (
    <div className={className}>
      {/* 파일 업로드 섹션 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          새 자료 업로드
        </h3>
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          categoryId={categoryId}
        />
      </div>

      {/* 자료 목록 섹션 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          업로드된 자료
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>업로드된 자료가 없습니다.</p>
            <p className="text-sm">
              위의 업로드 영역을 사용하여 자료를 추가해보세요.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <svg
                      className="h-8 w-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h4 className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate">
                          {resource.title || resource.name}
                        </h4>
                      </a>
                      <p className="text-sm text-gray-500">
                        {formatDate(resource.uploadDate)} •{" "}
                        {formatFileSize(resource.size)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
