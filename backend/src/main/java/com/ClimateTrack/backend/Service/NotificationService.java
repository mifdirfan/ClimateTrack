package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private FirebaseMessaging firebaseMessaging;
    @Autowired
    private UserRepository userRepository; // NEW: Inject user repository

    @Value("${notification.proximity.radius.km}")
    private double notificationRadiusKm;

    /**
     * Sends a push notification to a specific device.
     * @param deviceToken The FCM registration token of the target device.
     * @param title The title of the notification.
     * @param body The body text of the notification.
     */
    public void sendNotification(String deviceToken, String title, String body) {
        // Build the notification message payload
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setToken(deviceToken)
                .setNotification(notification)
                .build();

        try {
            // Send the message
            String response = firebaseMessaging.send(message);
            logger.info("Successfully sent message to token: {}. Response: {}", deviceToken, response);
        } catch (FirebaseMessagingException e) {
            logger.error("Failed to send message to token: {}. Error: {}", deviceToken, e.getMessage());
        }
    }
    public void sendProximityNotification(GeoJsonPoint location, String authorId, String title, String body) {
        Distance radius = new Distance(notificationRadiusKm, Metrics.KILOMETERS);
        List<User> nearbyUsers = userRepository.findByLastKnownLocationNear(location, radius);

        logger.info("Found {} users near the event location.", nearbyUsers.size());

        for (User user : nearbyUsers) {
            // Send notification if user has a token and is not the author
            if (user.getFcmToken() != null && !user.getId().equals(authorId)) {
                sendNotification(user.getFcmToken(), title, body);
            }
        }
    }
}