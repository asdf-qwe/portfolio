package com.port.folio.domain.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
    private Long id;
    private String publicId;
    private String categoryTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}