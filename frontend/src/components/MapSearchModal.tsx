import React, { useEffect, useRef, useState } from "react";
import { KakaoPlace } from "@/constants/mainPageConstants";

interface MapSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: KakaoPlace) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  searchResults: KakaoPlace[];
  isSearching: boolean;
  onSearch: () => void;
  selectedPlace: KakaoPlace | null;
  setSelectedPlace: (place: KakaoPlace | null) => void;
}

export const MapSearchModal: React.FC<MapSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
  searchKeyword,
  setSearchKeyword,
  searchResults,
  isSearching,
  onSearch,
  selectedPlace,
  setSelectedPlace,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<unknown>(null);
  const [markers, setMarkers] = useState<unknown[]>([]);

  // 카카오맵 초기화
  useEffect(() => {
    if (isOpen && !map && window.kakao && mapRef.current) {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
        level: 3,
      };
      const newMap = new window.kakao.maps.Map(mapRef.current, options);
      setMap(newMap);
    }
  }, [isOpen, map]);

  // 검색 결과가 변경될 때 마커 업데이트
  useEffect(() => {
    if (!map || !searchResults.length) return;

    // 기존 마커 제거
    // @ts-expect-error - 카카오맵 타입 정의가 복잡하여 타입 assertion 사용
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: unknown[] = [];

    searchResults.forEach((place, index) => {
      const position = new window.kakao.maps.LatLng(
        parseFloat(place.y),
        parseFloat(place.x)
      );

      const marker = new window.kakao.maps.Marker({
        position,
        // @ts-expect-error - 카카오맵 타입 정의가 복잡하여 타입 assertion 사용
        map: map,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedPlace(place);
        // @ts-expect-error - 카카오맵 타입 정의가 복잡하여 타입 assertion 사용
        map.setCenter(position);
      });

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs">
            <h4 class="font-bold text-gray-900 mb-1">${place.place_name}</h4>
            <p class="text-sm text-gray-600 mb-2">${place.address_name}</p>
            <p class="text-xs text-gray-500">${place.category_name}</p>
          </div>
        `,
      });

      // 마커에 마우스오버 이벤트
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        // @ts-expect-error - 카카오맵 타입 정의가 복잡하여 타입 assertion 사용
        infowindow.open(map, marker);
      });

      // 마커에 마우스아웃 이벤트
      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close();
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // 첫 번째 검색 결과를 중심으로 지도 이동
    if (searchResults.length > 0) {
      const firstPlace = searchResults[0];
      const centerPosition = new window.kakao.maps.LatLng(
        parseFloat(firstPlace.y),
        parseFloat(firstPlace.x)
      );
      // @ts-expect-error - 카카오맵 타입 정의가 복잡하여 타입 assertion 사용
      map.setCenter(centerPosition);
    }
  }, [map, searchResults, selectedPlace]);

  // 선택된 장소가 변경될 때 지도 중심 이동
  useEffect(() => {
    if (selectedPlace && map) {
      const position = new window.kakao.maps.LatLng(
        parseFloat(selectedPlace.y),
        parseFloat(selectedPlace.x)
      );
      // @ts-expect-error - 카카오맵 타입 정의가 복잡하여 타입 assertion 사용
      map.setCenter(position);
    }
  }, [selectedPlace, map]);

  const handleSelectPlace = () => {
    if (selectedPlace) {
      onSelectPlace(selectedPlace);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">주소 검색</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-500"
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

        {/* 검색 영역 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="장소명 또는 주소를 입력하세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
              />
            </div>
            <button
              onClick={onSearch}
              disabled={isSearching || !searchKeyword.trim()}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  검색 중...
                </div>
              ) : (
                "검색"
              )}
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex h-96">
          {/* 검색 결과 목록 */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="p-4 space-y-2">
                {searchResults.map((place, index) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPlace?.id === place.id
                        ? "bg-sky-50 border-2 border-sky-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {place.place_name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {place.address_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {place.category_name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
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
                  <p>검색어를 입력하고 검색 버튼을 클릭하세요</p>
                </div>
              </div>
            )}
          </div>

          {/* 지도 영역 */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full"></div>
            {!window.kakao && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
                  <p>카카오맵을 불러오는 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedPlace && (
              <div>
                <p className="font-medium text-gray-900">
                  선택된 장소: {selectedPlace.place_name}
                </p>
                <p className="text-gray-600">{selectedPlace.address_name}</p>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              취소
            </button>
            <button
              onClick={handleSelectPlace}
              disabled={!selectedPlace}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              선택하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
