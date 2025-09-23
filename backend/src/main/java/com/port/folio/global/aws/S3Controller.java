package com.port.folio.global.aws;



import com.port.folio.domain.post.dto.FileResource;
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

    // ✅ 일반 자료 업로드
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,
                             @RequestParam Long categoryId, @RequestParam String title) throws IOException {
        return s3Service.uploadFileToCategory(file, categoryId, title);
    }

    // ✅ 유저 프로필 이미지 업로드
    @PostMapping("/upload/profile-image")
    public String uploadProfileImage(@RequestParam("file") MultipartFile file,
                                     @RequestParam Long userId) throws IOException {
        return s3Service.uploadProfileImage(file, userId);
    }

    // ✅ 카테고리 대표 동영상 업로드
    @PostMapping("/upload/main-video")
    public String uploadMainVideo(@RequestParam("file") MultipartFile file,
                                  @RequestParam Long categoryId) throws IOException {
        return s3Service.uploadMainVideo(file, categoryId);
    }

    // ✅ 조회
    @GetMapping("/category/{categoryId}")
    public List<FileResource> getFilesByCategory(@PathVariable Long categoryId) {
        return s3Service.getFilesByCategory(categoryId);
    }

    @GetMapping("/user/{userId}/profile-image")
    public String getUserProfileImage(@PathVariable Long userId) {
        return s3Service.getUserProfileImage(userId);
    }

    @GetMapping("/category/{categoryId}/main-video")
    public String getMainVideoByCategory(@PathVariable Long categoryId) {
        return s3Service.getMainVideoByCategory(categoryId);
    }
}