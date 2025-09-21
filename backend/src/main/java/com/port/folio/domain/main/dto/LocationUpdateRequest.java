package com.port.folio.domain.main.dto;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class LocationUpdateRequest {
    private Double lat;
    private Double lng;
    private String address;
    private String email;
    private String phoneNumber;
}
