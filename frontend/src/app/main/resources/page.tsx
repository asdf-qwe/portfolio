"use client";

import { useState, useEffect } from "react";
import ProjectHeader from "@/components/ProjectHeader";
import FileUpload from "@/features/upload/components/FileUpload";

interface FileResource {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size: number;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<FileResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      // 나중에 백엔드 API로 교체
      const savedResources = localStorage.getItem("resources");
      if (savedResources) {
        setResources(JSON.parse(savedResources));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("자료 로딩 실패:", error);
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (url: string, fileName: string) => {
    const newResource: FileResource = {
      id: Date.now().toString(),
      name: fileName,
      url: url,
      uploadDate: new Date().toISOString(),
      size: 0, // 실제로는 백엔드에서 파일 크기 정보를 받아와야 함
    };

    const updatedResources = [...resources, newResource];
    setResources(updatedResources);
    localStorage.setItem("resources", JSON.stringify(updatedResources));
  };

  const handleDelete = (id: string) => {
    const updatedResources = resources.filter((resource) => resource.id !== id);
    setResources(updatedResources);
    localStorage.setItem("resources", JSON.stringify(updatedResources));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "알 수 없음";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectHeader />

      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">자료 관리</h1>

          {/* 파일 업로드 섹션 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              새 자료 업로드
            </h2>
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              categoryId={0} // 전역 자료 관리용 더미 ID
            />
          </div>

          {/* 자료 목록 섹션 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              업로드된 자료
            </h2>

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
                      <div className="flex items-center space-x-3">
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
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {resource.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(resource.uploadDate)} •{" "}
                            {formatFileSize(resource.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          다운로드
                        </a>
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
      </div>
    </div>
  );
}
