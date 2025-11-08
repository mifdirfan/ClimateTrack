package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Controller.ChatbotController;
import com.ClimateTrack.backend.Entity.DisasterEvent;
import com.ClimateTrack.backend.Entity.NewsArticle;
import com.ClimateTrack.backend.Repository.DisasterEventRepository;
import com.ClimateTrack.backend.Repository.NewsArticleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.ClimateTrack.backend.Controller.ChatbotController.ChatMessage;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final VectorStoreService vectorStoreService;
    private final EmbeddingService embeddingService;

    @Autowired
    private DisasterEventRepository disasterEventRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    @Value("${ollama.api.base.url}${ollama.api.chat.endpoint}")
    private String ollamaChatUrl;

    @Value("${ollama.chat.model}")
    private String chatModel;

    /**
     * Gets a response from the chatbot using Retrieval-Augmented Generation (RAG).
     * 1. Embeds the user's message.
     * 2. Retrieves relevant text chunks from the vector store.
     * 3. Constructs a prompt including the retrieved context and the user message.
     * 4. Calls the Ollama chat API with the augmented prompt.
     * 5. Parses and returns the AI's response.
     *
     * @param userMessage The message input from the user.
     * @return The chatbot's generated reply.
     */
    public String getChatbotResponse(String userMessage, List<ChatMessage> history) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Please provide a message to the chatbot.";
        }
        logger.info("Processing chatbot query: '{}'", userMessage);

        try {
            // 1. Generate embedding for the user query
            logger.debug("Generating embedding for query...");
            float[] queryEmbedding = embeddingService.generateEmbedding(userMessage);

            // 2. Retrieve relevant chunks from the vector store
            logger.debug("Retrieving relevant document chunks...");
            List<String> relevantChunks = vectorStoreService.findSimilarChunks(queryEmbedding, 3); // Retrieve top 3
            logger.debug("Retrieved {} relevant chunks.", relevantChunks.size());

            StringBuilder liveDataContext = new StringBuilder();
            String userMessageLower = userMessage.toLowerCase();

            // ONLY fetch and add live data if the user's query contains relevant keywords
            if (userMessageLower.contains("news") || userMessageLower.contains("alert") ||
                    userMessageLower.contains("warning") || userMessageLower.contains("latest") ||
                    userMessageLower.contains("typhoon") || userMessageLower.contains("disaster") ||
                    userMessageLower.contains("earthquake"))
            {
                logger.info("User query contains keywords. Fetching live data...");
                List<DisasterEvent> alerts = disasterEventRepository.findAll();
                List<NewsArticle> news = newsArticleRepository.findAll();

                liveDataContext.append("--- START CURRENT ALERTS ---\n");
                if (alerts.isEmpty()) {
                    liveDataContext.append("No active alerts reported.\n");
                } else {
                    alerts.stream().limit(5).forEach(alert -> {
                        liveDataContext.append(String.format("Alert: %s. Location: %s. Description: %s\n",
                                alert.getDisasterType(), alert.getLocationName(), alert.getDescription()));
                    });
                }
                liveDataContext.append("--- END CURRENT ALERTS ---\n\n");

                liveDataContext.append("--- START LATEST NEWS ---\n");
                if (news.isEmpty()) {
                    liveDataContext.append("No recent news found.\n");
                } else {
                    news.stream().limit(5).forEach(article -> {
                        liveDataContext.append(String.format("News: %s. Source: %s\n",
                                article.getTitle(), article.getSourceName()));
                    });
                }
                liveDataContext.append("--- END LATEST NEWS ---\n");
            }

            // 3. Construct the prompt for the LLM
            String context = String.join("\n\n---\n\n", relevantChunks); // Join chunks with separators
            String systemPrompt = "You are a helpful assistant for ClimateTrack... (rest of your prompt) ...\n\n" +
                    "CONTEXT:\n" +
                    liveDataContext.toString() + // This will now be EMPTY unless the user asked for news/alerts
                    (context.isEmpty() ? "No relevant context found." : context);

            logger.debug("Constructed system prompt (Context length: {} chars). Sending to LLM.", context.length());

            // 4. Call Ollama Chat API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", chatModel);
            requestBody.put("stream", false);

            // This is the key fix. We are now sending the full conversation.

            List<Map<String, String>> messageList = new ArrayList<>();

            // Add the system prompt first
            messageList.add(Map.of("role", "system", "content", systemPrompt));

            // Add all previous messages from history
            if (history != null) {
                for (ChatMessage msg : history) {
                    messageList.add(Map.of("role", msg.role(), "content", msg.content()));
                }
            }

            // Add the new, current message from the user
            messageList.add(Map.of("role", "user", "content", userMessage));

            requestBody.put("messages", messageList);


            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(ollamaChatUrl, entity, String.class);

            // 5. Parse the response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                // Adjust path based on actual Ollama response structure for non-streamed chat
                String assistantResponse = root.path("message").path("content").asText();

                if (assistantResponse.isEmpty()) {
                    logger.warn("Ollama returned an empty response content.");
                    return "Sorry, I received an empty response. Could you try rephrasing?";
                }
                logger.info("Successfully received chatbot response.");
                return assistantResponse.trim(); // Trim leading/trailing whitespace
            } else {
                logger.error("Ollama Chat API request failed with status {}: {}", response.getStatusCode(), response.getBody());
                return "Sorry, there was an issue communicating with the AI service.";
            }

        } catch (RestClientException e) {
            logger.error("Network or client error calling Ollama Chat API at {}: {}", ollamaChatUrl, e.getMessage(), e);
            return "Sorry, I couldn't reach the AI service due to a network issue.";
        } catch (Exception e) { // Catch other potential errors (embedding, JSON parsing, etc.)
            logger.error("Error processing chatbot request for message '{}': {}", userMessage, e.getMessage(), e);
            return "Sorry, I encountered an internal error. Please try again later.";
        }
    }
}
