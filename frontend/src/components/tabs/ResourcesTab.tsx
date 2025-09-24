import React from "react";
import FileUpload from "@/features/upload/components/FileUpload";
import { FileResource } from "@/features/upload/service/uploadService";
import { CONSTANTS } from "@/utils/constants";
import { isImageFile, formatFileSize, formatDate } from "@/utils/categoryUtils";

interface ResourcesTabProps {
  canEdit: boolean;
  categoryId: string;
  resources: FileResource[];
  isResourcesLoading: boolean;
  onUploadSuccess: () => void;
  onDeleteResource: (id: string) => Promise<void>;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({
  canEdit,
  categoryId,
  resources,
  isResourcesLoading,
  onUploadSuccess,
  onDeleteResource,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">자료</h2>
      </div>

      <div className="space-y-6">
        {canEdit && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              새 자료 업로드
            </h3>
            <FileUpload
              onUploadSuccess={onUploadSuccess}
              categoryId={parseInt(categoryId)}
              allowedTypes={CONSTANTS.FILE_TYPES}
              maxSizeMB={50}
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            업로드된 자료
          </h3>

          {isResourcesLoading ? (
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
              {canEdit && (
                <p className="text-sm">
                  위의 업로드 영역을 사용하여 자료를 추가해보세요.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {isImageFile(resource.name) ? (
                        <div className="w-8 h-8 rounded overflow-hidden bg-gray-100">
                          <img
                            src={resource.url}
                            alt={resource.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
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
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
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
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(resource.uploadDate)} •{" "}
                            {formatFileSize(resource.size)}
                          </p>
                        </div>

                        {canEdit && (
                          <div className="flex-shrink-0 ml-2">
                            <button
                              onClick={() => onDeleteResource(resource.id)}
                              className="inline-flex items-center p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="삭제"
                            >
                              <svg
                                className="w-4 h-4"
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
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
