package com.port.folio.domain.main.controller;

import com.port.folio.domain.main.dto.MainRequest;
import com.port.folio.domain.main.dto.MainResponse;
import com.port.folio.domain.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/main")
public class apiV1MainController {

    private final MainService mainService;

    @GetMapping
    public ResponseEntity<MainResponse> getMain(@RequestParam Long userId){
        MainResponse mainResponse = mainService.getMain(userId);
        return ResponseEntity.ok(mainResponse);
    }

    @PutMapping
    public ResponseEntity<String> updateMain(@RequestBody MainRequest req, @RequestParam Long userId){
        String message = mainService.updateMain(req, userId);
        return ResponseEntity.ok(message);
    }
}
