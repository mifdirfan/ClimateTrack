package com.ClimateTrack.backend.Service;

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
    public String getChatbotResponse(String userMessage) {
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

            // 3. Construct the prompt for the LLM
            String context = String.join("\n\n---\n\n", relevantChunks); // Join chunks with separators
            String systemPrompt = "You are a helpful assistant for ClimateTrack, specializing in flood preparedness and shelter information based ONLY on the provided context. " +
                    "Answer the user's question concisely using only the information given in the 'CONTEXT' section below. " +
                    "If the answer cannot be found in the context, clearly state that you do not have that specific information in your documents. Do not make up answers or use external knowledge.\n\n" +
                    "CONTEXT:\n" + (context.isEmpty() ? "No relevant context found." : context); // Handle empty context

            logger.debug("Constructed system prompt (Context length: {} chars). Sending to LLM.", context.length());

            // 4. Call Ollama Chat API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            // Structure according to Ollama /api/chat format
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", chatModel);
            requestBody.put("stream", false); // Get the full response at once
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userMessage)
            ));
            // Optional: Add Ollama options like temperature
            // Map<String, Object> options = Map.of("temperature", 0.7);
            // requestBody.put("options", options);


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
