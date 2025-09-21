package com.port.folio.domain.main.controller;

import com.port.folio.domain.main.dto.LocationResponse;
import com.port.folio.domain.main.dto.LocationUpdateRequest;
import com.port.folio.domain.main.service.UserLocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/location")
@RequiredArgsConstructor
public class ApiV1UserLocationController {

    private final UserLocationService userLocationService;

    @PutMapping
    public ResponseEntity<LocationResponse> updateLocation(
            @PathVariable Long userId,
            @Valid @RequestBody LocationUpdateRequest request) {

        LocationResponse response = userLocationService.updateLocation(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<LocationResponse> getLocation(@PathVariable Long userId) {
        LocationResponse response = userLocationService.getLocation(userId);
        return ResponseEntity.ok(response);
    }
}