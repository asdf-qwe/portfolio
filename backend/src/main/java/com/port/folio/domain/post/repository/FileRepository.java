package com.port.folio.domain.post.repository;

import com.port.folio.domain.post.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findAllByCategoryId(Long categoryId);

    @Query("SELECT f FROM File f " +
            "WHERE f.category.id = :categoryId " +
            "AND f.type NOT IN ('VIDEO', 'IMAGE')")
    List<File> findAllByCategoryIdExcludeVideoAndImage(@Param("categoryId") Long categoryId);
}
