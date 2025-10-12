import { useState, useRef, useEffect } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { KakaoPlace } from "@/constants/mainPageConstants";
import { LocationResponse } from "@/types/location";

export const useMapSearch = () => {
  // Kakao Maps SDK 로드 상태
  const [isKakaoMapsLoaded, setIsKakaoMapsLoaded] = useState(false);

  // 지도 검색 모달 상태
  const [isMapSearchModalOpen, setIsMapSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 검색 디바운싱을 위한 ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Kakao Maps SDK 로드 확인
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || "",
    libraries: ["services", "clusterer", "drawing"],
  });

  useEffect(() => {
    if (!loading && !error) {
      setIsKakaoMapsLoaded(true);
    }
  }, [loading, error]);

  // 지도 검색 함수
  const searchPlaces = async (keyword: string) => {
    if (!keyword.trim()) {
      return;
    }

    if (!isKakaoMapsLoaded) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      });
    } catch (error) {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // 검색 결과 선택 함수
  const selectPlace = async (
    place: KakaoPlace,
    canEdit: boolean,
    userId: string,
    currentLocation: LocationResponse,
    setCurrentLocation: (location: LocationResponse) => void
  ) => {
    if (!canEdit) return;

    try {
      const locationData = {
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
        address:
          place.road_address_name || place.address_name || place.place_name,
        email: currentLocation.email || "",
        phoneNumber: currentLocation.phoneNumber || "",
      };

      // API 호출로 위치 저장
      const { updateUserLocation } = await import(
        "@/features/main/service/locationService"
      );
      await updateUserLocation(parseInt(userId), locationData);

      // 로컬 상태 업데이트
      setCurrentLocation(locationData);
      setIsMapSearchModalOpen(false);
      setSearchKeyword("");
      setSearchResults([]);
    } catch (error) {
      console.error("위치 저장 실패:", error);
      alert("위치 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 검색어 입력 핸들러
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);

    // 이전 타이머 클리어
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 실시간 검색 (디바운싱)
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPlaces(value);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  return {
    isKakaoMapsLoaded,
    isMapSearchModalOpen,
    setIsMapSearchModalOpen,
    searchKeyword,
    setSearchKeyword,
    searchResults,
    setSearchResults,
    isSearching,
    searchPlaces,
    selectPlace,
    handleSearchInput,
  };
};
