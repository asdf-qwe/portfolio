package com.port.folio.domain.main.controller;

import com.port.folio.domain.main.dto.CardDto;
import com.port.folio.domain.main.dto.CardResponse;
import com.port.folio.domain.main.entity.CategoryName;
import com.port.folio.domain.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/card")
public class ApiV1CardController {
    private final MainService mainService;

    @PostMapping
    public ResponseEntity<String> createFirst(@RequestBody CardDto req, @RequestParam Long skillId) {
        mainService.createFirst(req, skillId);
        return ResponseEntity.ok("생성 완료");
    }

    @PutMapping
    public ResponseEntity<String> updateFirst(@RequestBody CardDto req, @RequestParam Long skillId, @RequestParam CategoryName categoryName){
        mainService.updateFirst(req, skillId, categoryName);
        return ResponseEntity.ok("수정 완료");
    }

    @GetMapping
    public ResponseEntity<CardResponse> getFirst(@RequestParam CategoryName categoryName, @RequestParam Long skillId){
        CardResponse firstCardDto = mainService.getFirst(categoryName, skillId);
        return ResponseEntity.ok(firstCardDto);
    }

    @PostMapping("/second")
    public ResponseEntity<String> createSecond(@RequestBody CardDto req, @RequestParam Long skillId) {
        mainService.createSecond(req, skillId);
        return ResponseEntity.ok("생성 완료");
    }

    @PutMapping("/second")
    public ResponseEntity<String> updateSecond(@RequestBody CardDto req, @RequestParam Long skillId, @RequestParam CategoryName categoryName){
        mainService.updateSecond(req, skillId, categoryName);
        return ResponseEntity.ok("수정 완료");
    }

    @GetMapping("/second")
    public ResponseEntity<CardResponse> getSecond(@RequestParam CategoryName categoryName,@RequestParam Long skillId){
        CardResponse firstCardDto = mainService.getSecond(skillId, categoryName);
        return ResponseEntity.ok(firstCardDto);
    }
}
