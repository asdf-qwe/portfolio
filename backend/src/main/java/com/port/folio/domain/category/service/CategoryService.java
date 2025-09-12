package com.port.folio.domain.category.service;

import com.port.folio.domain.category.dto.CategoryRequest;
import com.port.folio.domain.category.dto.CategoryResponse;
import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public Category createCategory(CategoryRequest req, Long userId){

        Category category = Category.builder()
                .categoryTitle(req.getCategoryTitle())
                .userId(userId)
                .build();
        return categoryRepository.save(category);
    }

    public List<CategoryResponse> getCategories(Long userId){
        List<Category> categories = categoryRepository.findAllByUserId(userId);
        return categories.stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getCategoryTitle(),
                        category.getCreatedAt(),
                        category.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }
}
