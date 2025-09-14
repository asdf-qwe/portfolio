package com.port.folio.domain.category.entity;

import com.port.folio.domain.post.entity.File;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.tab.entity.BasicTab;
import com.port.folio.domain.tab.entity.Tab;
import com.port.folio.domain.user.entity.User;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Getter@Setter
@NoArgsConstructor
@Entity
@AllArgsConstructor
public class Category extends BaseEntity {

    private String categoryTitle;

    @OneToMany(mappedBy = "category",cascade = CascadeType.REMOVE)
    private List<Post> posts;

    private Long userId;

    @OneToMany(mappedBy = "category",cascade = CascadeType.REMOVE)
    private List<Tab> tabs;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_video_id")
    private File mainVideo;

    @OneToOne
    private BasicTab basicTab;
}
