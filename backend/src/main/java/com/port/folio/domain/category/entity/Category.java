package com.port.folio.domain.category.entity;

import com.port.folio.domain.post.entity.File;
import com.port.folio.domain.post.entity.Introduce;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.tab.entity.BasicTab;
import com.port.folio.domain.tab.entity.Tab;
import com.port.folio.domain.tag.entity.Tag;
import com.port.folio.domain.user.entity.User;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "category", indexes = {
        @Index(name = "idx_category_public_id", columnList = "public_id", unique = true)
})
public class Category extends BaseEntity {

    @Column(name = "public_id", nullable = false, unique = true, updatable = false, length = 36)
    private String publicId; // 필드 초기화 제거

    @Column(nullable = false) // nullable 제약 추가
    private String categoryTitle;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Post> posts = new ArrayList<>(); // 복수형 + 초기화

    @Column(nullable = false) // nullable 제약 추가
    private Long userId;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Tab> tabs = new ArrayList<>(); // 초기화

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "main_video_id")
    private File mainVideo;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @Builder.Default
    private List<File> files = new ArrayList<>(); // 초기화

    @OneToOne(mappedBy = "category", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private BasicTab basicTab;

    @OneToOne(mappedBy = "category", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private Introduce introduce;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Tag> tags = new ArrayList<>(); // 초기화

    @PrePersist
    public void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID().toString();
        }
    }
}