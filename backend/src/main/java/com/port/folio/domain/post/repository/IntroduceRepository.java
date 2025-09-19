package com.port.folio.domain.post.repository;

import com.port.folio.domain.post.entity.Introduce;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntroduceRepository extends JpaRepository<Introduce, Long> {
    Introduce findByCategoryId(Long categoryId);
}
