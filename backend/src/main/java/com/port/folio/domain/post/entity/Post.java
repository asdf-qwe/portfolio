package com.port.folio.domain.post.entity;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.tab.entity.Tab;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Getter@Setter
@NoArgsConstructor
public class Post extends BaseEntity {

    private String title;
    private String content;
    private String imageUrl;
    private int views = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;


    @OneToOne
    @JoinColumn(name = "tab_id") // ✅ FK 컬럼
    private Tab tab;
}
