import React from "react";
import { KakaoPlace } from "@/constants/mainPageConstants";

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchKeyword: string;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  searchResults: KakaoPlace[];
  onSelectPlace: (place: KakaoPlace) => void;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  searchKeyword,
  onSearchInput,
  isSearching,
  searchResults,
  onSelectPlace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">위치 검색</h3>
            <button
              onClick={() => {
                onClose();
              }}
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
            근무 및 협업 가능한 지역을 검색하세요
          </p>
        </div>

        {/* 검색 입력 */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={onSearchInput}
              placeholder="도시, 지역, 장소를 입력하세요"
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="max-h-64 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {searchResults.map((place, index) => (
                <button
                  key={index}
                  onClick={() => onSelectPlace(place)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    {place.place_name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {place.road_address_name || place.address_name}
                  </div>
                  {place.category_name && (
                    <div className="text-xs text-gray-400 mt-1">
                      {place.category_name}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : searchKeyword && !isSearching ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>검색 결과가 없습니다</p>
              <p className="text-sm mt-1">다른 검색어를 시도해보세요</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>도시나 지역명을 검색하세요</p>
              <p className="text-sm mt-1">예: 서울, 부산, 강남역 등</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
