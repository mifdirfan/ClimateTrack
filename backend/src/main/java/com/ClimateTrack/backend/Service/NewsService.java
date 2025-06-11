package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.NewsArticle;
import com.ClimateTrack.backend.Repository.NewsArticleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
public class NewsService {

    @Autowired
    private NewsArticleRepository newsRepo;

    private final String NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=my&category=science&apiKey=f1bbbc6eab7141d6836741d9a724c6ba";

    public void fetchAndSaveNews() {
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(NEWS_API_URL, String.class);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode articles = root.path("articles");

            for (JsonNode article : articles) {
                NewsArticle news = new NewsArticle();
                news.setArticle_id(UUID.randomUUID().toString());
                news.setTitle(article.path("title").asText());
                news.setAuthor(article.path("author").asText());
                news.setUrl(article.path("url").asText());
                news.setImage_url(article.path("urlToImage").asText());
                news.setPublished_at(article.path("publishedAt").asText());
                news.setContent(article.path("content").asText());
                news.setSource_name(article.path("source").path("name").asText());

                newsRepo.save(news);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
