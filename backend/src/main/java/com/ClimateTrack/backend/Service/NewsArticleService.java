package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.NewsArticle;
import com.ClimateTrack.backend.Repository.NewsArticleRepository;
import com.ClimateTrack.backend.dto.NewsArticleDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleService {
    private static final Logger logger = LoggerFactory.getLogger(NewsArticleService.class);

    private final NewsArticleRepository newsArticleRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${news.api.key}") // Injects the key from application-secret.properties
    private String newsApiKey;

    @Value("${news.api.base-url.everything}")
    private String newsApiBaseUrl;

    @Value("${news.api.query}")
    private String newsApiQuery;

    @Transactional
    public void fetchAndSaveNews() {
        URI newsApiUri = UriComponentsBuilder.fromUriString(newsApiBaseUrl)
                .queryParam("qInTitle", newsApiQuery)
                .queryParam("language", "en")
                .queryParam("sortBy", "publishedAt")
                .build()
                .toUri();

        logger.info("Fetching news from NewsAPI...");

        try {
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + newsApiKey);
            headers.set("User-Agent", "ClimateTrackApp/1.0");

            // Create HttpEntity with headers
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Execute the request with headers
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    newsApiUri, HttpMethod.GET, entity, String.class);

            String response = responseEntity.getBody();
            logger.debug("Raw JSON response from NewsAPI: {}", response);
            if (response == null) {
                throw new RuntimeException("News API returned null response");
            }

            JsonNode root = objectMapper.readTree(response);
            if (root == null || !root.path("status").asText().equals("ok")) {
                logger.error("Failed to fetch news. API response: {}", root != null ? root.toString() : "null");
                return;
            }

            JsonNode articles = root.path("articles");

            // Clear old news before saving new articles
            newsArticleRepository.deleteAll();

            for (JsonNode article : articles) {
                NewsArticle news = NewsArticle.builder()
                        .articleId(UUID.randomUUID().toString())
                        .title(article.path("title").asText())
                        .author(article.path("author").asText(null))
                        .url(article.path("url").asText())
                        .imageUrl(article.path("urlToImage").asText(null))
                        .description(article.path("description").asText(null))
                        .publishedAt(Instant.parse(article.path("publishedAt").asText()))
                        .content(article.path("content").asText(null))
                        .sourceName(article.path("source").path("name").asText())
                        .build();
                newsArticleRepository.save(news);
            }
            logger.info("Successfully fetched and saved {} news articles.", articles.size());
        } catch (Exception e) {
            logger.error("Failed to fetch and save news", e);
        }
    }

    public List<NewsArticleDto> getAll() {
        return newsArticleRepository.findAll().stream().map(a -> NewsArticleDto.builder()
                .articleId(a.getArticleId())
                .title(a.getTitle())
                .sourceName(a.getSourceName())
                .author(a.getAuthor())
                .url(a.getUrl())
                .imageUrl(a.getImageUrl())
                .description(a.getDescription()) // Map content to description
                .content(a.getContent())
                .publishedAt(a.getPublishedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
