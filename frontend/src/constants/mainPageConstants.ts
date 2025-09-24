// 메인 페이지 상수들
export const MAIN_PAGE_CONSTANTS = {
  PAGINATION: {
    ITEMS_PER_PAGE: 3,
  },
  IMAGES: {
    DEFAULT_PROFILE: "/다운로드.jpeg",
  },
} as const;

// Kakao Maps 장소 검색 결과 타입
export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  place_url: string;
  distance: string;
}
