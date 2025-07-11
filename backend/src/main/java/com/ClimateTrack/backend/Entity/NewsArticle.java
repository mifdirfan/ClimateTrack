package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.*;

@Document("news_articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {
    @Id
    private String id;
    private String articleId;
    private String title;
    private String sourceName;
    private String author;
    private String url;
    private String imageUrl;
    private String publishedAt;
    private String content;

    public void setArticle_id(String string) {
    }

    public void setImage_url(String urlToImage) {
    }

    public void setPublished_at(String publishedAt) {
    }

    public void setSource_name(String text) {
    }
}
