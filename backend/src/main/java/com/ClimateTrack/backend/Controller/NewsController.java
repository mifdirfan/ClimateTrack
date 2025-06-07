package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.NewsArticleService;
import com.ClimateTrack.backend.dto.NewsArticleDto;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsArticleService service;

    @GetMapping
    public ResponseEntity<List<NewsArticleDto>> getAllNews() {
        return ResponseEntity.ok(service.getAll());
    }
}
