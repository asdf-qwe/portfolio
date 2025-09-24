import React from "react";

interface PhoneEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onChange: (phoneNumber: string) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export const PhoneEditModal: React.FC<PhoneEditModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  onChange,
  onSave,
  isUpdating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">전화번호 변경</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            연락 가능한 전화번호를 입력하세요
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                전화번호
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => onChange(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSave();
                  }
                }}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={onSave}
                disabled={isUpdating || !phoneNumber.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    저장하기
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isUpdating}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
