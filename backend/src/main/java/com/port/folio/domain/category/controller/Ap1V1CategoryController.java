package com.port.folio.domain.category.controller;

import com.port.folio.domain.category.dto.CategoryRequest;
import com.port.folio.domain.category.dto.CategoryResponse;
import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.category.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/category")
public class Ap1V1CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest req, @RequestParam Long userId) {
        Category category = categoryService.createCategory(req, userId);
        return ResponseEntity.ok(category);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> categoryList(@RequestParam Long userId) {
        List<CategoryResponse> categories = categoryService.getCategories(userId);
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteCategory(@RequestParam Long categoryId){
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("삭제 되었습니다");
    }
}
