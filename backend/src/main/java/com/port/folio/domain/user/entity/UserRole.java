package com.port.folio.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER,
    ADMIN;

    public boolean isAdmin() {
        return this == ADMIN;
    }
}
