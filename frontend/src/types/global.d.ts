// Kakao Maps API 타입 정의
interface KakaoPlace {
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

interface KakaoStatus {
  OK: string;
  ERROR: string;
  [key: string]: string;
}

interface KakaoPagination {
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  current: number;
  gotoPage: (page: number) => void;
  gotoFirst: () => void;
  gotoLast: () => void;
  nextPage: () => void;
  prevPage: () => void;
}

interface KakaoLatLngBounds {
  contain(latlng: KakaoLatLng): boolean;
  equals(bounds: KakaoLatLngBounds): boolean;
  extend(latlng: KakaoLatLng): void;
  getNorthEast(): KakaoLatLng;
  getSouthWest(): KakaoLatLng;
  isEmpty(): boolean;
  toString(): string;
}

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
  equals(latlng: KakaoLatLng): boolean;
  toString(): string;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  setMapTypeId(mapTypeId: string): void;
  getMapTypeId(): string;
  panTo(latlng: KakaoLatLng): void;
  addOverlayMapTypeId(mapTypeId: string): void;
  removeOverlayMapTypeId(mapTypeId: string): void;
  setBounds(bounds: KakaoLatLngBounds): void;
  getBounds(): KakaoLatLngBounds;
  relayout(): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
  setPosition(position: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setTitle(title: string): void;
  getTitle(): string;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
}

interface KakaoPlaces {
  keywordSearch(
    keyword: string,
    callback: (
      result: KakaoPlace[],
      status: string,
      pagination: KakaoPagination
    ) => void,
    options?: {
      category_group_code?: string;
      location?: KakaoLatLng;
      radius?: number;
      bounds?: KakaoLatLngBounds;
      sort?: "distance" | "accuracy";
      page?: number;
      size?: number;
    }
  ): void;
  categorySearch(
    categoryGroupCode: string,
    callback: (
      result: KakaoPlace[],
      status: string,
      pagination: KakaoPagination
    ) => void,
    options?: {
      location?: KakaoLatLng;
      radius?: number;
      bounds?: KakaoLatLngBounds;
      sort?: "distance" | "accuracy";
      page?: number;
      size?: number;
    }
  ): void;
}

interface KakaoGeocoderResult {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: Array<{
    address_name: string;
    address_type: string;
    x: string;
    y: string;
    address: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      mountain_yn: string;
      main_address_no: string;
      sub_address_no: string;
      zip_code: string;
    };
    road_address?: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      underground_yn: string;
      main_building_no: string;
      sub_building_no: string;
      building_name: string;
      zone_no: string;
    };
  }>;
}

interface KakaoMarkerImage {
  src: string;
  size: {
    width: number;
    height: number;
  };
  options?: {
    alt?: string;
    coords?: string;
    shape?: string;
    spriteOrigin?: {
      x: number;
      y: number;
    };
    spriteSize?: {
      width: number;
      height: number;
    };
    offset?: {
      x: number;
      y: number;
    };
    anchor?: {
      x: number;
      y: number;
    };
  };
}

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        LatLngBounds: new (
          sw?: KakaoLatLng,
          ne?: KakaoLatLng
        ) => KakaoLatLngBounds;
        Map: new (
          container: HTMLElement,
          options: {
            center: KakaoLatLng;
            level?: number;
            mapTypeId?: string;
            draggable?: boolean;
            scrollwheel?: boolean;
            disableDoubleClick?: boolean;
            disableDoubleClickZoom?: boolean;
            projectionId?: string;
            tileAnimation?: boolean;
            keyboardShortcuts?: boolean | object;
          }
        ) => KakaoMap;
        Marker: new (options: {
          map?: KakaoMap;
          position: KakaoLatLng;
          image?: KakaoMarkerImage; // Kakao Maps marker image object
          title?: string;
          clickable?: boolean;
          draggable?: boolean;
          visible?: boolean;
          zIndex?: number;
          opacity?: number;
          altitude?: number;
          range?: number;
        }) => KakaoMarker;
        services: {
          Geocoder: new () => KakaoGeocoder;
          Places: new () => KakaoPlaces;
          Status: KakaoStatus;
        };
        MapTypeId: {
          ROADMAP: string;
          SKYVIEW: string;
          HYBRID: string;
          OVERLAY: string;
          ROADVIEW: string;
          TRAFFIC: string;
          TERRAIN: string;
          BICYCLE: string;
          BICYCLE_HYBRID: string;
          USE_DISTRICT: string;
        };
        ControlPosition: {
          TOPLEFT: string;
          TOP: string;
          TOPRIGHT: string;
          BOTTOMLEFT: string;
          BOTTOM: string;
          BOTTOMRIGHT: string;
          LEFT: string;
          RIGHT: string;
        };
        // Kakao Maps SDK의 동적 속성들을 위한 인덱스 시그니처
        [key: string]: unknown;
      };
      // Kakao 객체의 추가 속성들을 위한 인덱스 시그니처
      [key: string]: unknown;
    };
  }
}

export {};
