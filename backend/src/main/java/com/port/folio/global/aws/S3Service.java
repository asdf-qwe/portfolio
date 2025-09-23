package com.port.folio.global.aws;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.post.dto.FileResource;
import com.port.folio.domain.post.entity.File;
import com.port.folio.domain.post.repository.FileRepository;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class S3Service {

    private final String bucket;
    private final S3Client s3Client;
    private final S3Presigner presigner;
    private final FileRepository fileRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public S3Service(
            @Value("${cloud.aws.region}") String region,
            @Value("${cloud.aws.s3.bucket}") String bucket,
            FileRepository fileRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.bucket = bucket;
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .build();

        this.presigner = S3Presigner.builder()
                .region(Region.of(region))
                .build();

        this.fileRepository = fileRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }


    /**
     * 공통 파일 업로드 (카테고리/유저 구분 없이)
     */
    public String uploadFile(MultipartFile file, String prefix) throws IOException {
        String key = prefix + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        return key;
    }

    /**
     * 카테고리 자료 업로드 (DB 저장 포함)
     */
    public String uploadFileToCategory(MultipartFile file, Long categoryId, String title) throws IOException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다"));

        String key = uploadFile(file, "files/" + categoryId);

        File fileEntity = File.builder()
                .title(title)
                .url(key)
                .category(category)
                .size(file.getSize())
                .type("FILE") // 또는 적절한 타입
                .build();

        fileRepository.save(fileEntity);

        return generatePresignedUrl(key);
    }

    /**
     * presigned URL 생성
     */
    public String generatePresignedUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        return presigner.presignGetObject(r -> r
                        .getObjectRequest(getObjectRequest)
                        .signatureDuration(Duration.ofMinutes(10)))
                .url()
                .toString();
    }

    public List<String> generatePresignedUrls(List<String> keys) {
        return keys.stream()
                .map(this::generatePresignedUrl)
                .toList();
    }

    /**
     * 카테고리별 자료 리스트 조회
     */
    public List<FileResource> getFilesByCategory(Long categoryId) {
        List<File> files = fileRepository.findAllByCategoryIdExcludeVideoAndImage(categoryId);
        return files.stream()
                .map(file -> {
                    FileResource resource = new FileResource();
                    resource.setId(file.getId().toString());
                    resource.setName(file.getTitle()); // title을 name으로 사용 (또는 별도 originalName 필드가 있다면 그것 사용)
                    resource.setTitle(file.getTitle()); // title 필드
                    resource.setUrl(generatePresignedUrl(file.getUrl()));
                    resource.setUploadDate(file.getCreatedAt()); // BaseEntity에서 상속받은 필드
                    resource.setSize(file.getSize() != null ? file.getSize() : 0L);
                    return resource;
                })
                .collect(Collectors.toList());
    }
    /**
     * 유저 프로필 이미지 업로드 (1개만 유지)
     */
    public String uploadProfileImage(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다"));

        // 기존 이미지 있으면 삭제
        if (user.getProfileImage() != null) {
            deleteFile(user.getProfileImage().getUrl());
            fileRepository.delete(user.getProfileImage());
        }

        String key = uploadFile(file, "profile-images");

        File profileImage = File.builder()
                .url(key)
                .user(user)
                .type("IMAGE")
                .build();

        fileRepository.save(profileImage);

        user.setProfileImage(profileImage);
        userRepository.save(user);

        return generatePresignedUrl(key);
    }

    /**
     * 카테고리 대표 동영상 업로드 (1개만 유지)
     */
    public String uploadMainVideo(MultipartFile file, Long categoryId) throws IOException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다"));

        // 기존 대표 동영상 있으면 삭제
        if (category.getMainVideo() != null) {
            deleteFile(category.getMainVideo().getUrl());
            fileRepository.delete(category.getMainVideo());
        }

        String key = uploadFile(file, "main-videos");

        File video = File.builder()
                .url(key)
                .category(category)
                .type("VIDEO")
                .build();

        fileRepository.save(video);

        category.setMainVideo(video);
        categoryRepository.save(category);

        return generatePresignedUrl(key);
    }

    /**
     * 유저 프로필 이미지 조회
     */
    public String getUserProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다"));

        if (user.getProfileImage() == null) return null;
        return generatePresignedUrl(user.getProfileImage().getUrl());
    }

    /**
     * 카테고리 대표 동영상 조회
     */
    public String getMainVideoByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다"));

        if (category.getMainVideo() == null) return null;
        return generatePresignedUrl(category.getMainVideo().getUrl());
    }

    /**
     * S3 파일 삭제
     */
    public void deleteFile(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build());
    }

    public void deleteFiles(Long fileId){
        File file = fileRepository.findById(fileId)
                .orElseThrow(()-> new IllegalArgumentException("파일을 찾을 수 없습니다."));
        deleteFile(file.getUrl());
        fileRepository.delete(file);
    }
}
