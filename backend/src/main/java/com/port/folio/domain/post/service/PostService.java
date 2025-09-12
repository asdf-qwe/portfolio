package com.port.folio.domain.post.service;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.post.dto.CreatePostDto;
import com.port.folio.domain.post.dto.PostListDto;
import com.port.folio.domain.post.dto.PostResponse;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.post.repository.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;

    public Post createPost(CreatePostDto dto, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다"));

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imageUrl(dto.getImageUrl())
                .category(category)
                .build();

        return postRepository.save(post);

    }

    public List<PostListDto> getPosts(Long categoryId) {
        List<Post> posts = postRepository.findByCategoryId(categoryId);
        return posts.stream()
                .map(post -> new PostListDto(
                        post.getTitle(),
                        post.getViews()
                ))
                .collect(Collectors.toList());
    }

    public PostResponse getPost(Long postId) {

        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다"));

        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return new PostResponse(post.getTitle(),post.getContent(),post.getImageUrl(),post.getViews());
    }
}
