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
import org.springframework.web.client.RestTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    //    @Autowired
//    private FirebaseMessaging firebaseMessaging;
    @Autowired
    private UserRepository userRepository; // NEW: Inject user repository
    @Autowired
    private RestTemplate restTemplate;

    @Value("${notification.proximity.radius.km}")
    private double notificationRadiusKm;

    /**
     * Sends a push notification to a specific device.
     *
     * @param deviceToken The FCM registration token of the target device.
     * @param title       The title of the notification.
     * @param body        The body text of the notification.
     */
    public void sendNotification(String deviceToken, String title, String body) {
        // Validate the token format (basic check)
        if (deviceToken == null || !deviceToken.startsWith("ExponentPushToken[")) {
            logger.warn("Attempted to send notification with invalid Expo token: {}", deviceToken);
            return;
        }

        // --- Use RestTemplate to call Expo Push API ---
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("Accept-Encoding", "gzip, deflate");
        // headers.set("Host", "exp.host"); // Usually not needed, RestTemplate handles this

        // Create the request body according to Expo's API
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("to", deviceToken);
        requestBody.put("title", title);
        requestBody.put("body", body);
        // Add other Expo options if needed (e.g., sound, data, badge)
        // requestBody.put("sound", "default");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

//        // Build the notification message payload
//        Notification notification = Notification.builder()
//                .setTitle(title)
//                .setBody(body)
//                .build();
//
//        Message message = Message.builder()
//                .setToken(deviceToken)
//                .setNotification(notification)
//                .build();

        try {
            logger.info("Sending notification to Expo token: {}", deviceToken);
            ResponseEntity<String> response = restTemplate.exchange(
                    EXPO_PUSH_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Log Expo's response (contains status like "ok" or "error")
            logger.info("Expo Push API response Status: {}, Body: {}", response.getStatusCode(), response.getBody());

            // You might want to parse the response body JSON to check the ticket status
            // (e.g., if status is 'error', log the details)

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Handle HTTP errors (4xx, 5xx) from Expo's server
            logger.error("HTTP error sending notification to {}: {} - {}", deviceToken, e.getStatusCode(), e.getResponseBodyAsString(), e);
        } catch (RestClientException e) {
            // Handle other network/client errors
            logger.error("Failed to send notification via Expo API to token {}: {}", deviceToken, e.getMessage(), e);
        }
    }

    /**
     * Finds nearby users and sends them notifications via Expo Push API.
     *
     * @param location The GeoJsonPoint of the event/report.
     * @param authorId The ID of the user who created the event/report (to exclude them).
     * @param title    The notification title.
     * @param body     The notification body.
     */

    public void sendProximityNotification(GeoJsonPoint location, String authorId, String title, String body) {
        Distance radius = new Distance(notificationRadiusKm, Metrics.KILOMETERS);
        List<User> nearbyUsers = userRepository.findByLastKnownLocationNear(location, radius);

        logger.info("Found {} users near the event location.", nearbyUsers.size());

        for (User user : nearbyUsers) {
            // Send notification if user has a token (which should be an Expo token now)
            // AND is not the author (handle null authorId for system events)
            if (user.getFcmToken() != null && (authorId == null || !user.getId().equals(authorId))) {
                // The fcmToken field now stores the Expo token
                sendNotification(user.getFcmToken(), title, body);
            } else if (user.getFcmToken() == null) {
                logger.debug("Skipping user {} - no FCM token.", user.getUsername());
            } else {
                logger.debug("Skipping user {} - is the author.", user.getUsername());
            }
        }
    }
}