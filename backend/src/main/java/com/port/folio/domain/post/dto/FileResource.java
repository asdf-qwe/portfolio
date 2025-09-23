package com.port.folio.domain.post.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class FileResource {
    private String id;
    private String name;      // 표시용 이름 (title과 동일)
    private String title;     // 파일 제목
    private String url;       // presigned URL
    private LocalDateTime uploadDate;
    private Long size;

    // getters and setters
}