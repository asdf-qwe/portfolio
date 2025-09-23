"use client";

import { useState, useRef } from "react";
import {
  uploadFileToS3,
  validateFileSize,
  validateFileType,
} from "../service/uploadService";

interface FileUploadProps {
  onUploadSuccess: (url: string, fileName: string) => void;
  categoryId: number; // ✅ categoryId 추가
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export default function FileUpload({
  onUploadSuccess,
  categoryId, // ✅ categoryId 추가
  allowedTypes = [],
  maxSizeMB = 10,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);

    // 파일 검증
    if (!validateFileSize(file, maxSizeMB)) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
      setError(
        `허용되지 않는 파일 형식입니다. 허용 형식: ${allowedTypes.join(", ")}`
      );
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFileToS3(file, categoryId, file.name); // ✅ 파일명 자동 사용
      onUploadSuccess(url, file.name);

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      setError("파일 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* 드래그 앤 드롭 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
          accept={allowedTypes.length > 0 ? allowedTypes.join(",") : undefined}
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-lg text-gray-600">
                파일을 여기에 드래그하거나{" "}
                <span className="text-blue-500 font-medium">클릭하여 선택</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                최대 {maxSizeMB}MB까지 업로드 가능
                {allowedTypes.length > 0 && (
                  <span className="block">
                    허용 형식: {allowedTypes.join(", ")}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
