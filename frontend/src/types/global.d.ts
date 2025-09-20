declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        services: {
          Geocoder: new () => any;
          Places: new () => any;
        };
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

export {};
