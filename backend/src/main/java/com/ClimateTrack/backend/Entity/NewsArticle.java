package com.ClimateTrack.backend.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "news_articles")
public class NewsArticle {
    @Id
    private String article_id;

    private String title;
    private String source_name;
    private String author;
    private String url;
    private String image_url;
    private String published_at;
    private String content;

    // Getters and Setters

    public String getArticle_id() {
        return article_id;
    }

    public String getTitle() {
        return title;
    }

    public String getSource_name() {
        return source_name;
    }

    public String getAuthor() {
        return author;
    }

    public String getUrl() {
        return url;
    }

    public String getImage_url() {
        return image_url;
    }

    public String getPublished_at() {
        return published_at;
    }

    public String getContent() {
        return content;
    }


    public void setArticle_id(String article_id) {
        this.article_id = article_id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSource_name(String source_name) {
        this.source_name = source_name;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public void setPublished_at(String published_at) {
        this.published_at = published_at;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
