package com.port.folio.domain.post.controller;

import com.port.folio.domain.post.dto.CreatePostDto;
import com.port.folio.domain.post.dto.PostListDto;
import com.port.folio.domain.post.dto.PostResponse;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class Ap1V1PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody CreatePostDto dto, @RequestParam Long categoryId){
        Post post = postService.createPost(dto,categoryId);
        return ResponseEntity.ok("게시글 성공");
    }

    @GetMapping("/list")
    public ResponseEntity<List<PostListDto>> readPostList(@RequestParam Long categoryId){
        List<PostListDto> postList = postService.getPosts(categoryId);
        return ResponseEntity.ok(postList);
    }

    @GetMapping
    public ResponseEntity<PostResponse> readPost(@RequestParam Long postId) {
        PostResponse post = postService.getPost(postId);
        return ResponseEntity.ok(post);
    }
}
