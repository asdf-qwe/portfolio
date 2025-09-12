package com.port.folio.global.aws;


import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.post.entity.File;
import com.port.folio.domain.post.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;
    private final FileRepository fileRepository;
    private final CategoryRepository categoryRepository;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,
                             @RequestParam Long categoryId) throws IOException {
        // 1) S3에 업로드
        String key = s3Service.uploadFile(file, categoryId);

        // 2) DB 저장 (카테고리 연관)
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다"));

        File fileEntity = File.builder()
                .url(key) // 실제 저장되는 건 S3 key
                .category(category)
                .build();

        fileRepository.save(fileEntity);

        // 3) 업로드한 파일 바로 접근할 수 있는 presigned URL 리턴
        return s3Service.generatePresignedUrl(key);
    }

    @GetMapping("/category/{categoryId}")
    public List<String> getFilesByCategory(@PathVariable Long categoryId) {
        return s3Service.getUrlsByCategory(categoryId);
    }
}