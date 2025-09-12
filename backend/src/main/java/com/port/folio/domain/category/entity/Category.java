package com.port.folio.domain.category.entity;

import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.user.entity.User;
import com.port.folio.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Getter@Setter
@NoArgsConstructor
@Entity
@AllArgsConstructor
public class Category extends BaseEntity {

    private String categoryTitle;

    @OneToMany(mappedBy = "category")
    private List<Post> posts;

    private Long userId;
}
