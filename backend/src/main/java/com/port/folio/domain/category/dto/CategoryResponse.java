package com.port.folio.domain.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CategoryResponse {
    private Long id;           // 추가 권장
    private String categoryTitle;
    private LocalDateTime createdAt;  // 추가 권장
    private LocalDateTime updatedAt;  // 추가 권장
}