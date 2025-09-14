package com.port.folio.domain.tab.entity;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter@Setter
@NoArgsConstructor
@SuperBuilder
public class BasicTab extends BaseEntity {

    private String basicTab1;
    private String basicTab2;

    private String basicContent1;
    private String basicContent2;

    private Long userId;

    @OneToOne
    private Category category;

}
