package com.port.folio.domain.tag.repository;

import com.port.folio.domain.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findAllByCategoryId(Long categoryId);
}
