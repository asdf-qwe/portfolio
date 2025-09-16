package com.port.folio.domain.main.entity;

import com.port.folio.domain.user.entity.User;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class SkillCategory extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private CategoryName name;

    @OneToMany(mappedBy = "skillCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Card> cards;

    @OneToOne
    private User user;
}
