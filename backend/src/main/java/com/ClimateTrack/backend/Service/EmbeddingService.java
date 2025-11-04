package com.ClimateTrack.backend.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private static final Logger logger = LoggerFactory.getLogger(EmbeddingService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper; // Make sure ObjectMapper is a bean or injected

    @Value("${ollama.api.base.url}${ollama.api.embeddings.endpoint}")
    private String ollamaEmbeddingUrl;

    @Value("${ollama.embedding.model}")
    private String embeddingModel;

    /**
     * Generates a numerical embedding for the given text using the configured Ollama model.
     *
     * @param text The text to embed.
     * @return A float array representing the embedding.
     * @throws RuntimeException if embedding generation fails.
     */
    public float[] generateEmbedding(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or empty for embedding.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", embeddingModel);
        requestBody.put("prompt", text); // Use "prompt" for embeddings endpoint

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        logger.debug("Requesting embedding from Ollama for text snippet (first 50 chars): '{}...'", text.substring(0, Math.min(50, text.length())));

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(ollamaEmbeddingUrl, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode embeddingNode = root.path("embedding"); // Ollama embedding response format
                if (embeddingNode.isArray()) {
                    float[] embedding = new float[embeddingNode.size()];
                    for (int i = 0; i < embeddingNode.size(); i++) {
                        embedding[i] = (float) embeddingNode.get(i).asDouble();
                    }
                    logger.debug("Successfully generated embedding of size {}.", embedding.length);
                    return embedding;
                } else {
                    logger.error("Ollama embedding response did not contain a valid 'embedding' array: {}", response.getBody());
                    throw new RuntimeException("Failed to parse embedding from Ollama: Invalid response structure.");
                }
            }
            // Handle non-OK status codes explicitly
            logger.error("Ollama embedding API request failed with status {}: {}", response.getStatusCode(), response.getBody());
            throw new RuntimeException("Failed to generate embedding. Ollama API returned status " + response.getStatusCode());

        } catch (RestClientException e) {
            logger.error("Network or client error calling Ollama embedding API at {}: {}", ollamaEmbeddingUrl, e.getMessage(), e);
            throw new RuntimeException("Network error generating embedding: " + e.getMessage(), e);
        } catch (JsonProcessingException e) {
            logger.error("Error parsing Ollama embedding API response: {}", e.getMessage(), e);
            throw new RuntimeException("Error parsing embedding response: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            logger.error("Illegal argument during embedding request: {}", e.getMessage(), e);
            throw e; // Re-throw specific known exceptions if needed
        } catch (Exception e) { // Catch broader exceptions
            logger.error("Unexpected error during embedding generation: {}", e.getMessage(), e);
            throw new RuntimeException("Unexpected error generating embedding.", e);
        }
    }
}
