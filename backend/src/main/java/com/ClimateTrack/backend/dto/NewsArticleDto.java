package com.ClimateTrack.backend.dto;
import lombok.*;



@Data
@Builder
public class NewsArticleDto {
    private String articleId;
    private String title;
    private String sourceName;
    private String author;
    private String url;
    private String imageUrl;
    private String publishedAt;
    private String content;
}
