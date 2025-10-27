package com.port.folio.domain.category.repository;

import com.port.folio.domain.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    List<Category> findAllByUserId(Long userId);
    Optional<Category> findByPublicId(String publicId);
    void deleteByUserId(Long userId);
}
