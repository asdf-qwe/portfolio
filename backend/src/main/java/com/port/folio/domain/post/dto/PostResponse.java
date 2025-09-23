package com.port.folio.domain.post.dto;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {

    private String content;
    private String imageUrl;


}
