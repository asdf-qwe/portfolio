package com.port.folio.domain.main.controller;

import com.port.folio.domain.main.dto.SkillCategoryRequest;
import com.port.folio.domain.main.dto.SkillCategoryResponse;
import com.port.folio.domain.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/skill")
public class ApiV1SkillController {
    private final MainService mainService;

    @PutMapping
    public ResponseEntity<?> changeCategory(@RequestBody SkillCategoryRequest req, @RequestParam Long userId){
        mainService.changeCategory(req,userId);
        return ResponseEntity.ok("수정 완료");
    }

    @GetMapping
    public ResponseEntity<SkillCategoryResponse> getSkillCategory(@RequestParam Long userId){
        SkillCategoryResponse skillCategoryResponse = mainService.getSkillCategory(userId);
        return ResponseEntity.ok(skillCategoryResponse);
    }



}
