package com.port.folio.domain.main.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
@AllArgsConstructor
public class LocationResponse {
    private Double lat;
    private Double lng;
    private String address;
    private String email;
    private String phoneNumber;
}
