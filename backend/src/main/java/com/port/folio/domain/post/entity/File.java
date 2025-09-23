package com.port.folio.domain.post.entity;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.user.entity.User;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class File extends BaseEntity {

    private String title;

    private String url;

    private String type;

    private Long size;

    @OneToOne(fetch = FetchType.LAZY)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
