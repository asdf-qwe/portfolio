package com.port.folio.domain.main.entity;

import com.port.folio.domain.user.entity.User;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Column;
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
public class Main extends BaseEntity {

    private String greeting;
    private String smallGreeting;
    @Column(columnDefinition = "TEXT")
    private String introduce;
    private String name;
    private String job;
    private WorkHistory workHistory;

    @OneToOne
    private User user;

}
