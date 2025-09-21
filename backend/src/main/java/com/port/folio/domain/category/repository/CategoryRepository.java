package com.port.folio.domain.category.repository;

import com.port.folio.domain.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    List<Category> findAllByUserId(Long userId);
    void deleteByUserId(Long userId);
}
