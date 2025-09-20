package com.port.folio.domain.main.entity;

import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class SecondCard extends BaseEntity {
    private String title;
    private String subTitle;
    private String content;

    @ManyToOne
    @JoinColumn(name = "skill_category_id")
    private SkillCategory skillCategory;
}
