package com.port.folio.domain.post.entity;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class Introduce extends BaseEntity {

    private String title;
    private String content;

    @OneToOne
    private Category category;
}
