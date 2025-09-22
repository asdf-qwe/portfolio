package com.port.folio.domain.tab.entity;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
public class Tab extends BaseEntity {

    private String tabName;

    @ManyToOne
    private Category category;

    @OneToOne(mappedBy = "tab",cascade = CascadeType.ALL)  // ✅ 연관관계 매핑 필요
    private Post post;
}
