package com.port.folio.domain.post.repository;

import com.port.folio.domain.post.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findAllByCategoryId(Long categoryId);
}
