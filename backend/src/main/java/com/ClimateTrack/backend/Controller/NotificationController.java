package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @PostMapping("/send-test/{username}")
    public ResponseEntity<String> sendTestNotification(@PathVariable String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getFcmToken() != null && !user.getFcmToken().isEmpty()) {
                notificationService.sendNotification(
                        user.getFcmToken(),
                        "Hello, " + username,
                        "This is a test notification from ClimateTrack!"
                );
                return ResponseEntity.ok("Test notification sent to " + username);
            } else {
                return ResponseEntity.badRequest().body("User does not have an FCM token.");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
