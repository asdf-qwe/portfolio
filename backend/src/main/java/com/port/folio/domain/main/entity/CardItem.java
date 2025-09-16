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
public class CardItem extends BaseEntity {

    private String content;
    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;
}
