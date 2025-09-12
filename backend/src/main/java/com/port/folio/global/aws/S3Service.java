package com.port.folio.global.aws;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.post.entity.File;
import com.port.folio.domain.post.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class S3Service {

    private final String bucket;
    private final S3Client s3Client;
    private final S3Presigner presigner;
    private final FileRepository fileRepository;
    private final CategoryRepository categoryRepository;

    public S3Service(
            @Value("${cloud.aws.region}") String region,
            @Value("${cloud.aws.s3.bucket}") String bucket, FileRepository fileRepository, FileRepository fileRepository1, CategoryRepository categoryRepository
    ) {
        this.bucket = bucket;

        // IAM Role 자격 증명 자동 사용 (accessKey, secretKey 필요 없음)
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .build();

        this.presigner = S3Presigner.builder()
                .region(Region.of(region))
                .build();
        this.fileRepository = fileRepository1;
        this.categoryRepository = categoryRepository;
    }

    public String uploadFile(MultipartFile file, Long categoryId) throws IOException {
        String key = "pdfs/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType("application/pdf")
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );

        return key;
    }

    public String generatePresignedUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        return presigner.presignGetObject(r -> r.getObjectRequest(getObjectRequest)
                        .signatureDuration(Duration.ofMinutes(10)))
                .url()
                .toString();
    }

    // Service
    public List<String> getUrlsByCategory(Long categoryId) {
        List<File> files = fileRepository.findAllByCategoryId(categoryId);
        List<String> keys = files.stream()
                .map(File::getUrl)
                .toList();

        return generatePresignedUrls(keys);
    }

    public List<String> generatePresignedUrls(List<String> keys) {
        return keys.stream()
                .map(this::generatePresignedUrl) // 기존 단일 메서드 재사용
                .toList();
    }


}
