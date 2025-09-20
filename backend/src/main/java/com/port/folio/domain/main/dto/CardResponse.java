package com.port.folio.domain.main.dto;

import com.port.folio.domain.main.entity.CategoryName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CardResponse {
    private String title;
    private String subTitle;
    private String content;
    private CategoryName categoryName;
}
