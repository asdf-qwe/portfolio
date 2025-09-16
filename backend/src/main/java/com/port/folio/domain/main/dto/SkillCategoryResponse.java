package com.port.folio.domain.main.dto;

import com.port.folio.domain.main.entity.CategoryName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SkillCategoryResponse {
    private CategoryName name;
}
