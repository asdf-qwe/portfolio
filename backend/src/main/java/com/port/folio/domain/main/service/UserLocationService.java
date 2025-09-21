package com.port.folio.domain.main.service;

import com.port.folio.domain.main.dto.LocationResponse;
import com.port.folio.domain.main.dto.LocationUpdateRequest;
import com.port.folio.domain.main.entity.UserLocation;
import com.port.folio.domain.main.repository.UserLocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class UserLocationService {

    private final UserLocationRepository userLocationRepository;

    public UserLocationService(UserLocationRepository userLocationRepository) {
        this.userLocationRepository = userLocationRepository;
    }

    public LocationResponse updateLocation(Long userId, LocationUpdateRequest request) {
        UserLocation location = userLocationRepository.findByUserId(userId)
                .orElse(new UserLocation());

        location.setUserId(userId);
        location.setLat(request.getLat());
        location.setLng(request.getLng());
        location.setAddress(request.getAddress());
        location.setEmail(request.getEmail());
        location.setPhoneNumber(request.getPhoneNumber());
        location.setUpdatedAt(LocalDateTime.now());

        if (location.getId() == null) {
            location.setCreatedAt(LocalDateTime.now());
        }

        UserLocation saved = userLocationRepository.save(location);

        return new LocationResponse(
                saved.getLat(),
                saved.getLng(),
                saved.getAddress(),
                saved.getEmail(),
                saved.getPhoneNumber()
        );
    }

    public LocationResponse getLocation(Long userId) {
        UserLocation location = userLocationRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("위치 정보를 찾을 수 없습니다"));

        return new LocationResponse(
                location.getLat(),
                location.getLng(),
                location.getAddress(),
                location.getEmail(),
                location.getPhoneNumber()
        );
    }
}