package com.port.folio.domain.tab.dto;


import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class TabRes {
    private Long id;
    private String tabName;
    private Long categoryId;
    private String postContent;
}
