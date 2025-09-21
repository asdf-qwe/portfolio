// src/types/location.ts
export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export interface LocationUpdateRequest {
  lat: number;
  lng: number;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface LocationResponse {
  lat: number;
  lng: number;
  address: string;
  email: string;
  phoneNumber: string;
}
