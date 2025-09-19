package com.port.folio.domain.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IntroduceResponse {
    private String title;
    private String content;
}
