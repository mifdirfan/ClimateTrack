package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Repository.NewsArticleRepository;
import com.ClimateTrack.backend.dto.NewsArticleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleService {
    private final NewsArticleRepository newsArticleRepository;

    public List<NewsArticleDto> getAll() {
        return newsArticleRepository.findAll().stream().map(a -> NewsArticleDto.builder()
                .articleId(a.getArticleId())
                .title(a.getTitle())
                .sourceName(a.getSourceName())
                .author(a.getAuthor())
                .url(a.getUrl())
                .imageUrl(a.getImageUrl())
                .publishedAt(a.getPublishedAt())
                .content(a.getContent())
                .build()
        ).collect(Collectors.toList());
    }
}
