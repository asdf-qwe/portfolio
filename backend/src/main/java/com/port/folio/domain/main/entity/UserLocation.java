package com.port.folio.domain.main.entity;

import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class UserLocation extends BaseEntity {
    private Long userId;
    private Double lat;
    private Double lng;
    private String address;
    private String email;
    private String phoneNumber;
}
