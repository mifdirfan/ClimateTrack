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

    @Value("${news.api.exclude-domains:#{null}}") // Inject the domains to exclude
    private String newsApiExcludeDomains;

    @Value("${news.api.include-domains:#{null}}") // Inject the domains to include
    private String newsApiIncludeDomains;

    @Transactional
    public void fetchAndSaveNews() {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(newsApiBaseUrl)
                .queryParam("qInTitle", newsApiQuery)
                .queryParam("language", "en")
                .queryParam("sortBy", "publishedAt");

        // Prioritize including specific domains if configured
        if (newsApiIncludeDomains != null && !newsApiIncludeDomains.isEmpty()) {
            uriBuilder.queryParam("domains", newsApiIncludeDomains);
        }
        // Otherwise, use the excludeDomains parameter if it's configured
        else if (newsApiExcludeDomains != null && !newsApiExcludeDomains.isEmpty()) {
            uriBuilder.queryParam("excludeDomains", newsApiExcludeDomains);
        }

        URI newsApiUri = uriBuilder.build().toUri();

        logger.info("Fetching news from URL: {}", newsApiUri); // Log the exact URL being called

        try {
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Api-Key", newsApiKey); // Correct header for NewsAPI
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

            JsonNode articlesNode = root.path("articles");
            if (articlesNode.isMissingNode() || !articlesNode.isArray()) {
                logger.warn("News API response is OK but does not contain an 'articles' array.");
                return;
            }

            // 1. Process all new articles into a list first
            List<NewsArticle> newArticles = new java.util.ArrayList<>();
            for (JsonNode article : articlesNode) {
                newArticles.add(NewsArticle.builder()
                        .articleId(UUID.randomUUID().toString())
                        .title(article.path("title").asText())
                        .author(article.path("author").asText(null))
                        .url(article.path("url").asText())
                        .imageUrl(article.path("urlToImage").asText(null))
                        .description(article.path("description").asText(null))
                        .publishedAt(Instant.parse(article.path("publishedAt").asText()))
                        .content(article.path("content").asText(null))
                        .sourceName(article.path("source").path("name").asText())
                        .build());
            }

            // 2. If new articles were successfully processed, replace the old ones
            newsArticleRepository.deleteAll();
            newsArticleRepository.saveAll(newArticles);

            logger.info("Successfully fetched and saved {} news articles.", newArticles.size());
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
