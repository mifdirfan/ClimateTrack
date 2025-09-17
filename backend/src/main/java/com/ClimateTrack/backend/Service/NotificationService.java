package com.ClimateTrack.backend.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private FirebaseMessaging firebaseMessaging;

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
}