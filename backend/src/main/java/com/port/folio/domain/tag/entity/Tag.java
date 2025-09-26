package com.port.folio.domain.tag.entity;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter@Setter
@NoArgsConstructor
@SuperBuilder
public class Tag extends BaseEntity {
    private String tagName;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;
}
