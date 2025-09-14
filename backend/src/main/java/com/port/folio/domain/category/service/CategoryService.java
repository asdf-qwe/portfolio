package com.port.folio.domain.category.service;

import com.port.folio.domain.category.dto.CategoryRequest;
import com.port.folio.domain.category.dto.CategoryResponse;
import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.tab.entity.BasicTab;
import com.port.folio.domain.tab.repository.BasicTabRepository;
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
    private final BasicTabRepository basicTabRepository;
    public Category createCategory(CategoryRequest req, Long userId){

        Category category = Category.builder()
                .categoryTitle(req.getCategoryTitle())
                .userId(userId)
                .build();

        BasicTab basicTab = BasicTab.builder()
                .basicTab1("프로젝트 소개")
                .basicTab2("자료")
                .basicContent1("소개 없음")
                .basicContent2("자료 없음")
                .userId(userId)
                .category(category)
                .build();

        Category category1 = categoryRepository.save(category);
        basicTabRepository.save(basicTab);

        return category1;
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

    public void deleteCategory (Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리가 없습니다"));

        categoryRepository.delete(category);
    }
}
