package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.dto.AuthRequestDto;
import com.ClimateTrack.backend.dto.AuthResponseDto;
import com.ClimateTrack.backend.dto.LocationRequestDto;
import com.ClimateTrack.backend.dto.RegisterRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint; // Add this import
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Set<String> blacklist = Collections.synchronizedSet(new HashSet<>());


    public Optional<User> validateUser(AuthRequestDto request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPasswordHash()));
    }

    public User registerUser(RegisterRequestDto request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            return null;
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        Date now = new Date();
        newUser.setCreatedAt(now);
        newUser.setUpdatedAt(now);

        return userRepository.save(newUser);
    }

    public Optional<AuthResponseDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> AuthResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .build());
    }

    public User updateLocation(String username, LocationRequestDto locationDto) {
        return userRepository.findByUsername(username).map(user -> {
            user.setLastKnownLocation(new GeoJsonPoint(locationDto.getLongitude(), locationDto.getLatitude()));
            if (locationDto.getFcmToken() != null && !locationDto.getFcmToken().isEmpty()) {
                user.setFcmToken(locationDto.getFcmToken());
            }
            user.setUpdatedAt(new Date());
            return userRepository.save(user);
        }).orElse(null);
    }


    public void blacklistToken(String token) {
        blacklist.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.contains(token);
    }
}