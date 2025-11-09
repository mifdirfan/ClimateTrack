package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.*; // Import all entities
import com.ClimateTrack.backend.Repository.*; // Import all repositories
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.geo.Distance; // Import
import org.springframework.data.geo.Metrics; // Import
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.ClimateTrack.backend.Controller.ChatbotController.ChatMessage;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final VectorStoreService vectorStoreService;
    private final EmbeddingService embeddingService;

    // --- Inject all the repositories we need ---
    @Autowired
    private DisasterEventRepository disasterEventRepository;
    @Autowired
    private NewsArticleRepository newsArticleRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Value("${ollama.api.base.url}${ollama.api.chat.endpoint}")
    private String ollamaChatUrl;
    @Value("${ollama.chat.model}")
    private String chatModel;

    // --- Define our "intent" keywords ---
    private static final List<String> NEAR_ME_KEYWORDS = List.of("near me", "nearby", "around me", "my location");
    private static final List<String> HOW_TO_KEYWORDS = List.of("how to", "what is", "prepare", "manual", "guide");
    private static final List<String> NEWS_KEYWORDS = List.of("news", "latest", "alert", "warning");

    /**
     * Main method to get the chatbot response.
     */
    public String getChatbotResponse(String userMessage, List<ChatMessage> history, User user) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Please provide a message to the chatbot.";
        }
        logger.info("Processing chatbot query: '{}'", userMessage);

        try {
            // 1. Build the context string based on query intent
            String context = buildContextForQuery(userMessage, user);

            // 2. Construct the prompt
            String systemPrompt = "You are a helpful assistant for ClimateTrack. You answer user queries based on the provided context. If no context is relevant, you have a normal conversation.\n\n" +
                    "CONTEXT:\n" +
                    (context.isEmpty() ? "No relevant context found." : context);

            logger.debug("Constructed system prompt. Sending to LLM.");

            // 3. Call Ollama Chat API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", chatModel);
            requestBody.put("stream", false);

            List<Map<String, String>> messageList = new ArrayList<>();
            messageList.add(Map.of("role", "system", "content", systemPrompt));
            if (history != null) {
                for (ChatMessage msg : history) {
                    messageList.add(Map.of("role", msg.role(), "content", msg.content()));
                }
            }
            messageList.add(Map.of("role", "user", "content", userMessage));
            requestBody.put("messages", messageList);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(ollamaChatUrl, entity, String.class);

            // 4. Parse and return the response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String assistantResponse = root.path("message").path("content").asText();

                if (assistantResponse.isEmpty()) {
                    logger.warn("Ollama returned an empty response content.");
                    return "Sorry, I received an empty response. Could you try rephrasing?";
                }
                logger.info("Successfully received chatbot response.");
                return assistantResponse.trim();
            } else {
                logger.error("Ollama Chat API request failed with status {}: {}", response.getStatusCode(), response.getBody());
                return "Sorry, there was an issue communicating with the AI service.";
            }

        } catch (RestClientException e) {
            logger.error("Network or client error calling Ollama Chat API at {}: {}", ollamaChatUrl, e.getMessage(), e);
            return "Sorry, I couldn't reach the AI service due to a network issue.";
        } catch (Exception e) {
            logger.error("Error processing chatbot request for message '{}': {}", userMessage, e.getMessage(), e);
            return "Sorry, I encountered an internal error. Please try again later.";
        }
    }

    /**
     * Helper method to build the context string based on user intent.
     */
    private String buildContextForQuery(String userMessage, User user) {
        String userMessageLower = userMessage.toLowerCase();
        StringBuilder contextBuilder = new StringBuilder();
        GeoJsonPoint userLocation = (user != null) ? user.getLastKnownLocation() : null;

        // --- Add User Location Context (Always helpful) ---
        if (userLocation != null) {
            contextBuilder.append("--- START USER LOCATION ---\n");
            contextBuilder.append(String.format("The user's current location is: (Latitude: %f, Longitude: %f)\n",
                    userLocation.getY(), userLocation.getX()));
            contextBuilder.append("--- END USER LOCATION ---\n\n");
        }

        // --- Intent 1: "Near Me" ---
        if (containsKeyword(userMessageLower, NEAR_ME_KEYWORDS) && userLocation != null) {
            logger.info("Query matches 'Near Me' intent. Fetching local data.");
            Distance distance = new Distance(20, Metrics.KILOMETERS); // 20km radius

            // Fetch nearby alerts
            List<DisasterEvent> alerts = disasterEventRepository.findByLocationNear(userLocation, distance);
            if (!alerts.isEmpty()) {
                contextBuilder.append("--- START NEARBY ALERTS ---\n");
                alerts.stream().limit(5).forEach(alert -> {
                    contextBuilder.append(String.format("Alert: %s at %s. (Reported: %s)\n",
                            alert.getDisasterType(), alert.getLocationName(), alert.getReportedAt()));
                });
                contextBuilder.append("--- END NEARBY ALERTS ---\n\n");
            }

            // Fetch nearby user reports
            List<Report> reports = reportRepository.findByLocationNear(userLocation, distance);
            if (!reports.isEmpty()) {
                contextBuilder.append("--- START NEARBY USER REPORTS ---\n");
                reports.stream().limit(5).forEach(report -> {
                    contextBuilder.append(String.format("Report: '%s' (%s) by %s. (Reported: %s)\n",
                            report.getTitle(), report.getDisasterType(), report.getPostedByUsername(), report.getReportedAt()));
                });
                contextBuilder.append("--- END NEARBY USER REPORTS ---\n\n");
            }

            // Fetch nearby community posts
            List<CommunityPost> posts = communityPostRepository.findByLocationNear(userLocation, distance);
            if (!posts.isEmpty()) {
                contextBuilder.append("--- START NEARBY COMMUNITY POSTS ---\n");
                posts.stream().limit(5).forEach(post -> {
                    contextBuilder.append(String.format("Post: '%s' by %s. (Posted: %s)\n",
                            post.getTitle(), post.getPostedByUsername(), post.getPostedAt()));
                });
                contextBuilder.append("--- END NEARBY COMMUNITY POSTS ---\n\n");
            }

            // --- Intent 2: "How-To / Info" ---
        } else if (containsKeyword(userMessageLower, HOW_TO_KEYWORDS)) {
            logger.info("Query matches 'How-To' intent. Fetching from Vector Store.");
            float[] queryEmbedding = embeddingService.generateEmbedding(userMessage);
            List<String> relevantChunks = vectorStoreService.findSimilarChunks(queryEmbedding, 3);
            if (!relevantChunks.isEmpty()) {
                contextBuilder.append("--- START RELEVANT GUIDES ---\n");
                contextBuilder.append(String.join("\n\n---\n\n", relevantChunks));
                contextBuilder.append("\n--- END RELEVANT GUIDES ---\n\n");
            }

            // --- Intent 3: "General News / Alerts" (but not "near me") ---
        } else if (containsKeyword(userMessageLower, NEWS_KEYWORDS)) {
            logger.info("Query matches 'General News' intent. Fetching latest articles.");
            List<NewsArticle> news = newsArticleRepository.findAll(); // In a real app, sort by date and limit
            if (!news.isEmpty()) {
                contextBuilder.append("--- START LATEST NEWS ---\n");
                news.stream()
                        .sorted((a1, a2) -> a2.getPublishedAt().compareTo(a1.getPublishedAt())) // Sort newest first
                        .limit(5)
                        .forEach(article -> {
                            contextBuilder.append(String.format("News: %s (Source: %s)\n",
                                    article.getTitle(), article.getSourceName()));
                        });
                contextBuilder.append("--- END LATEST NEWS ---\n\n");
            }
        }
        // --- Intent 4: "Greeting" ---
        // If no intent is matched, the contextBuilder remains (mostly) empty.
        // The LLM will just see the user's location and "No relevant context found."
        // This is fine and will result in a simple conversational reply.

        return contextBuilder.toString();
    }

    /**
     * Helper to check if a string contains any keyword from a list.
     */
    private boolean containsKeyword(String message, List<String> keywords) {
        for (String keyword : keywords) {
            if (message.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}