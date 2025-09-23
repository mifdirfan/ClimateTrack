package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("news_articles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsArticle {
    @Id
    private String id;
    private String articleId;
    private String title;
    private String sourceName;
    private String author;
    private String url;
    private String imageUrl;
    private Instant publishedAt;
    private String content;
}