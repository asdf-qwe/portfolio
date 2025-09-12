package com.port.folio.domain.post.dto;

import com.port.folio.domain.category.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class CreatePostDto {
    private String title;
    private String content;
    private String imageUrl;
}
