package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.NewsArticleService;
import com.ClimateTrack.backend.dto.NewsArticleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<List<NewsArticleDto>> getAllNews() {
        return ResponseEntity.ok(newsArticleService.getAll());
    }

    @PostMapping("/fetch-current-news")
    public ResponseEntity<String> triggerNewsFetch() {
        newsArticleService.fetchAndSaveNews();
        return ResponseEntity.ok("News fetch process triggered successfully.");
    }
}