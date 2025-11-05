package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List; // <-- 1. IMPORT LIST

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    private final ChatbotService chatbotService;

    // --- START CHANGES ---

    // 2. DEFINE a new record for history messages
    public record ChatMessage(String role, String content) {}

    // 3. UPDATE ChatRequest to include history
    public record ChatRequest(String message, List<ChatMessage> history) {}

    // 4. DEFINE the ChatResponse (was already here)
    public record ChatResponse(String reply) {}

    // --- END CHANGES ---

    /**
     * Handles chatbot query requests from authenticated users.
     * @param request ChatRequest DTO containing the user's message AND history.
     * @param principal Authenticated user principal provided by Spring Security.
     * @return ResponseEntity containing the ChatResponse DTO or an error status.
     */
    @PostMapping("/query")
    public ResponseEntity<?> getChatbotReply(@RequestBody ChatRequest request, Principal principal) {
        // 1. Check Authentication
        if (principal == null || principal.getName() == null) {
            logger.warn("Unauthorized attempt to access chatbot endpoint.");
            // Use standard ResponseEntity builder for errors
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ChatResponse("User not authenticated."));
        }
        String username = principal.getName(); // Get username for logging

        // 2. Validate Input
        if (request == null || request.message() == null || request.message().trim().isEmpty()) {
            logger.warn("Received empty message from user {}", username);
            return ResponseEntity.badRequest().body(new ChatResponse("Message cannot be empty."));
        }

        logger.info("Received chatbot query from user {}: '{}'", username, request.message());

        try {
            // 3. Call Service (--- 5. PASS THE HISTORY ---)
            String reply = chatbotService.getChatbotResponse(request.message(), request.history());

            // 4. Return Response
            logger.info("Sending chatbot reply to user {}.", username);
            return ResponseEntity.ok(new ChatResponse(reply));

        } catch (Exception e) {
            // Catch potential exceptions from the service layer (though service should handle most)
            logger.error("Unexpected error in ChatbotController for user {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatResponse("An unexpected server error occurred."));
        }
    }
}