package com.port.folio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.entity.UserRole;
import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.user.repository.UserRepository;
import com.port.folio.domain.category.dto.CategoryRequest;
import com.port.folio.domain.category.dto.CategoryResponse;

import java.lang.reflect.Field;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Transactional
@ActiveProfiles("test")
class CategoryTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();

        testUser = userRepository.findByLoginId("test_user_123")
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .loginId("test_user_123")
                            .password("encoded_password_123")
                            .nickname("테스트유저")
                            .email("test@example.com")
                            .role(UserRole.USER)
                            .imageUrl("https://example.com/profile.jpg")
                            .bio("테스트 계정입니다")
                            .build();
                    return userRepository.save(newUser);
                });

        System.out.println("사용자 설정 완료: " + testUser.getLoginId() + " (ID: " + testUser.getId() + ")");
    }

    private CategoryRequest createCategoryRequest(String categoryTitle) {
        CategoryRequest request = new CategoryRequest();
        try {
            Field titleField = CategoryRequest.class.getDeclaredField("categoryTitle");
            titleField.setAccessible(true);
            titleField.set(request, categoryTitle);
        } catch (Exception e) {
            fail("CategoryRequest 생성 실패: " + e.getMessage());
        }
        return request;
    }

    @Test
    @DisplayName("카테고리 목록 조회 - MockMvc로 인증 우회")
    void testGetCategories_WithMockMvc() throws Exception {
        // Given - 카테고리 3개 생성
        for (int i = 1; i <= 3; i++) {
            Category category = Category.builder()
                    .categoryTitle("테스트 카테고리 " + i)
                    .userId(testUser.getId())
                    .build();
            categoryRepository.saveAndFlush(category);
        }


        String responseJson = mockMvc.perform(get("/api/category")
                        .param("userId", testUser.getId().toString()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();


        CategoryResponse[] categories = objectMapper.readValue(responseJson, CategoryResponse[].class);
        assertThat(categories).hasSize(3);

        System.out.println("카테고리 목록 조회 성공: " + categories.length + "개");
    }

    @Test
    @DisplayName("UUID 하이브리드 시스템 - 카테고리 생성 및 UUID 검증")
    void testCategoryCreation_WithUuidGeneration() throws Exception {

        CategoryRequest createRequest = createCategoryRequest("UUID 테스트 카테고리");
        String requestJson = objectMapper.writeValueAsString(createRequest);


        String responseJson = mockMvc.perform(post("/api/category")
                        .param("userId", testUser.getId().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Then
        Category created = objectMapper.readValue(responseJson, Category.class);
        assertThat(created).isNotNull();
        assertThat(created.getPublicId()).isNotNull();
        assertThat(created.getId()).isNotNull();
        assertThat(created.getPublicId()).matches(
                "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
        );
        assertThat(created.getCategoryTitle()).isEqualTo("UUID 테스트 카테고리");

        System.out.println("카테고리 생성 성공:");
        System.out.println("   - Category ID: " + created.getId());
        System.out.println("   - Category PublicID: " + created.getPublicId());
        System.out.println("   - Category Title: " + created.getCategoryTitle());
    }

    @Test
    @DisplayName("하이브리드 시스템 - 숫자 ID로 삭제")
    void testHybridSystem_DeleteByNumericId() throws Exception {
        // 1. 카테고리 생성
        CategoryRequest createRequest = createCategoryRequest("삭제 테스트");
        String requestJson = objectMapper.writeValueAsString(createRequest);

        String createResponseJson = mockMvc.perform(post("/api/category")
                        .param("userId", testUser.getId().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Category created = objectMapper.readValue(createResponseJson, Category.class);
        assertThat(created).isNotNull();

        // 2. 숫자 ID로 삭제
        String deleteResponse = mockMvc.perform(delete("/api/category")
                        .param("categoryId", created.getId().toString()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(deleteResponse).isEqualTo("삭제 되었습니다");

        // 3. 삭제 확인
        assertThat(categoryRepository.findById(created.getId())).isEmpty();

        System.out.println("하이브리드 시스템 삭제 테스트 성공:");
        System.out.println("   - 숫자 ID로 삭제: ");
        System.out.println("   - 삭제된 카테고리 ID: " + created.getId());
    }
}