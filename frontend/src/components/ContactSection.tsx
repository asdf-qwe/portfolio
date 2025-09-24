import React from "react";
import { LocationResponse } from "@/types/location";
import { KakaoPlace } from "@/constants/mainPageConstants";

interface ContactSectionProps {
  currentLocation: LocationResponse;
  locationLoading: boolean;
  isGlobalEditMode: boolean;
  isEmailEditModalOpen: boolean;
  isPhoneEditModalOpen: boolean;
  isMapSearchModalOpen: boolean;
  editEmail: string;
  editPhoneNumber: string;
  isUpdatingContact: boolean;
  searchKeyword: string;
  searchResults: KakaoPlace[];
  isSearching: boolean;
  onEmailIconClick: () => void;
  onPhoneIconClick: () => void;
  onLocationIconClick: () => void;
  onEmailModalClose: () => void;
  onPhoneModalClose: () => void;
  onLocationModalClose: () => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailUpdate: () => void;
  onPhoneUpdate: () => void;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect: (place: KakaoPlace) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentLocation,
  locationLoading,
  isGlobalEditMode,
  isEmailEditModalOpen,
  isPhoneEditModalOpen,
  isMapSearchModalOpen,
  editEmail,
  editPhoneNumber,
  isUpdatingContact,
  searchKeyword,
  searchResults,
  isSearching,
  onEmailIconClick,
  onPhoneIconClick,
  onLocationIconClick,
  onEmailModalClose,
  onPhoneModalClose,
  onLocationModalClose,
  onEmailChange,
  onPhoneChange,
  onEmailUpdate,
  onPhoneUpdate,
  onSearchInput,
  onPlaceSelect,
}) => {
  return (
    <>
      {/* Contact Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-transparent">
              함께 일해보세요
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              새로운 프로젝트나 협업 기회를 찾고 계신가요? 함께 의미 있는 일을
              만들어 나가고 싶습니다.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div
                className={`w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group ${
                  isGlobalEditMode ? "cursor-pointer" : ""
                }`}
                onClick={isGlobalEditMode ? onEmailIconClick : undefined}
              >
                <svg
                  className={`w-8 h-8 text-white ${
                    isGlobalEditMode
                      ? "group-hover:scale-110 transition-transform duration-300"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {/* 클릭 힌트 */}
                {isGlobalEditMode && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-4">이메일</h3>
              <p className="text-gray-300 mb-4">프로젝트 문의 및 협업 제안</p>
              <div className="text-center">
                <a
                  href={
                    currentLocation.email
                      ? `mailto:${currentLocation.email}`
                      : undefined
                  }
                  className={`font-medium text-lg transition-colors duration-300 ${
                    currentLocation.email
                      ? "text-sky-400 hover:text-sky-300"
                      : "text-gray-400 cursor-default"
                  }`}
                >
                  {currentLocation.email || "이메일 정보가 없습니다"}
                </a>
                {isGlobalEditMode && (
                  <p className="text-gray-400 text-sm mt-2">
                    아이콘을 클릭하여 이메일 변경
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div
                className={`w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group ${
                  isGlobalEditMode ? "cursor-pointer" : ""
                }`}
                onClick={isGlobalEditMode ? onPhoneIconClick : undefined}
              >
                <svg
                  className={`w-8 h-8 text-white ${
                    isGlobalEditMode
                      ? "group-hover:scale-110 transition-transform duration-300"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {/* 클릭 힌트 */}
                {isGlobalEditMode && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-4">전화번호</h3>
              <p className="text-gray-300 mb-4">직접 연락 및 긴급 문의</p>
              <div className="text-center">
                <a
                  href={
                    currentLocation.phoneNumber
                      ? `tel:${currentLocation.phoneNumber}`
                      : undefined
                  }
                  className={`font-medium text-lg transition-colors duration-300 ${
                    currentLocation.phoneNumber
                      ? "text-cyan-400 hover:text-cyan-300"
                      : "text-gray-400 cursor-default"
                  }`}
                >
                  {currentLocation.phoneNumber || "전화번호 정보가 없습니다"}
                </a>
                {isGlobalEditMode && (
                  <p className="text-gray-400 text-sm mt-2">
                    아이콘을 클릭하여 전화번호 변경
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div
                className={`w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group ${
                  isGlobalEditMode ? "cursor-pointer" : ""
                }`}
                onClick={isGlobalEditMode ? onLocationIconClick : undefined}
              >
                <svg
                  className={`w-8 h-8 text-white ${
                    isGlobalEditMode
                      ? "group-hover:scale-110 transition-transform duration-300"
                      : ""
                  }`}
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
                {/* 클릭 힌트 */}
                {isGlobalEditMode && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-4">위치</h3>
              <p className="text-gray-300 mb-4">근무 및 협업 가능 지역</p>
              <div className="text-center">
                <span className="text-sky-400 font-medium text-lg">
                  {locationLoading
                    ? "위치 정보를 불러오는 중..."
                    : currentLocation.address
                    ? currentLocation.address
                    : "위치 정보가 없습니다"}
                </span>
                {isGlobalEditMode && (
                  <p className="text-gray-400 text-sm mt-2">
                    아이콘을 클릭하여 위치 변경
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                현재 새로운 프로젝트 제안을 기다리고 있습니다
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 이메일 편집 모달 */}
      {isEmailEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">이메일 변경</h3>
                <button
                  onClick={onEmailModalClose}
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
                연락 가능한 이메일 주소를 입력하세요
              </p>
            </div>

            {/* 입력 폼 */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        onEmailUpdate();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={onEmailUpdate}
                    disabled={isUpdatingContact || !editEmail.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isUpdatingContact ? (
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
                    onClick={onEmailModalClose}
                    disabled={isUpdatingContact}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 전화번호 편집 모달 */}
      {isPhoneEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  전화번호 변경
                </h3>
                <button
                  onClick={onPhoneModalClose}
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
                    value={editPhoneNumber}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        onPhoneUpdate();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={onPhoneUpdate}
                    disabled={isUpdatingContact || !editPhoneNumber.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isUpdatingContact ? (
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
                    onClick={onPhoneModalClose}
                    disabled={isUpdatingContact}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 지도 검색 모달 */}
      {isMapSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">위치 검색</h3>
                <button
                  onClick={onLocationModalClose}
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
                      onClick={() => onPlaceSelect(place)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {place.place_name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {place.address_name}
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
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </path>
                  </svg>
                  <p>도시나 지역명을 검색하세요</p>
                  <p className="text-sm mt-1">예: 서울, 부산, 강남역 등</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
