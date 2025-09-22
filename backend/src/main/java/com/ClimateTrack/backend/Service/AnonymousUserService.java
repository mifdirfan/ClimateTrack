package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.dto.AnonymousLocationRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class AnonymousUserService {

    @Autowired
    private UserRepository userRepository;

    public User updateOrCreateAnonymousUser(AnonymousLocationRequestDto request) {
        Optional<User> userOptional = userRepository.findById(request.getAnonymousId());

        User user;
        if (userOptional.isPresent()) {
            // User exists, update their location and token
            user = userOptional.get();
            user.setLastKnownLocation(new GeoJsonPoint(request.getLongitude(), request.getLatitude()));
            user.setFcmToken(request.getFcmToken());
            user.setUpdatedAt(new Date());
        } else {
            // User is new, create a new anonymous record
            user = new User();
            user.setId(request.getAnonymousId());
            user.setAnonymous(true);
            user.setCreatedAt(new Date());
            user.setLastKnownLocation(new GeoJsonPoint(request.getLongitude(), request.getLatitude()));
            user.setFcmToken(request.getFcmToken());
        }

        return userRepository.save(user);
    }
}
